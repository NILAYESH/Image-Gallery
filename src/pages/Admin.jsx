// Admin: administrative management page showing the user list, dynamic total count, and delete actions.
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

const initialUsers = [
  {
    userId: "USR001",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    joinedDate: "2026-01-14",
    totalUploads: 42,
    totalPhotos: 38,
    totalVideos: 4,
  },
  {
    userId: "USR002",
    name: "Mira Bennett",
    email: "mira.bennett@example.com",
    joinedDate: "2026-02-03",
    totalUploads: 27,
    totalPhotos: 24,
    totalVideos: 3,
  },
  {
    userId: "USR003",
    name: "Ishan Kapoor",
    email: "ishan.kapoor@example.com",
    joinedDate: "2026-02-19",
    totalUploads: 61,
    totalPhotos: 54,
    totalVideos: 7,
  },
  {
    userId: "USR004",
    name: "Leila Morgan",
    email: "leila.morgan@example.com",
    joinedDate: "2026-03-08",
    totalUploads: 18,
    totalPhotos: 18,
    totalVideos: 0,
  },
  {
    userId: "USR005",
    name: "Noah Okafor",
    email: "noah.okafor@example.com",
    joinedDate: "2026-04-22",
    totalUploads: 35,
    totalPhotos: 30,
    totalVideos: 5,
  },
];

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function Admin({ onLogout }) {
  const [users, setUsers] = useState(initialUsers);
  const [userToDelete, setUserToDelete] = useState(null);
  const cancelDeleteRef = useRef(null);

  useEffect(() => {
    if (!userToDelete) return undefined;

    cancelDeleteRef.current?.focus();
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setUserToDelete(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [userToDelete]);

  function confirmDelete() {
    if (!userToDelete) return;

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.userId !== userToDelete.userId),
    );
    setUserToDelete(null);
  }

  return (
    <div className="app-shell admin-shell" data-theme="dark">
      <div className="login-background" aria-hidden="true" />
      <Navbar adminMode onLogout={onLogout} />

      <main className="admin-dashboard">
        <header className="admin-page-heading">
          <div>
            <p className="eyebrow">Administration</p>
            <h1>Admin Panel</h1>
            <p>Manage and remove registered users.</p>
          </div>
          <div className="admin-user-count" aria-label={`${users.length} total users`}>
            <strong>{users.length}</strong>
            <span>Total Users</span>
          </div>
        </header>

        <section className="admin-user-section" aria-labelledby="user-list-title">
          <h2 id="user-list-title">User Management</h2>
          <div
            className="admin-table-scroll"
            role="region"
            aria-label="Registered users"
            tabIndex="0"
          >
            <table className="admin-user-table">
              <thead>
                <tr>
                  <th scope="col">User ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email ID</th>
                  <th scope="col">Joined Date</th>
                  <th scope="col">Total Uploads</th>
                  <th scope="col">Total Photos</th>
                  <th scope="col">Total Videos</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId}>
                    <td className="admin-user-id">{user.userId}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <time dateTime={user.joinedDate}>
                        {dateFormatter.format(new Date(`${user.joinedDate}T00:00:00Z`))}
                      </time>
                    </td>
                    <td>{user.totalUploads}</td>
                    <td>{user.totalPhotos}</td>
                    <td>{user.totalVideos}</td>
                    <td>
                      <button
                        className="admin-delete-button"
                        type="button"
                        onClick={() => setUserToDelete(user)}
                        aria-label={`Delete ${user.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="admin-empty-row" colSpan="8">
                      No users remain.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {userToDelete && (
        <div
          className="admin-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setUserToDelete(null);
          }}
        >
          <section
            className="admin-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            aria-describedby="delete-user-description"
          >
            <h2 id="delete-user-title">Delete this user?</h2>
            <p id="delete-user-description">
              {userToDelete.name} will be removed from this demo user list.
            </p>
            <div className="admin-dialog-actions">
              <button
                ref={cancelDeleteRef}
                className="admin-cancel-button"
                type="button"
                onClick={() => setUserToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="admin-confirm-delete-button"
                type="button"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Admin;
