import React, { useState, useEffect } from "react";

const AdminProfilePage = () => {
  const [adminData, setAdminData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState("");

  
  const fetchAdminData = () => {
    try {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      console.log(storedData)
      if (storedData) {
        setAdminData(storedData);
        setOriginalData(storedData); 
      } else {
        setError("No admin data found in local storage.");
      }
    } catch (err) {
      setError("Failed to load admin data from local storage.");
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem("adminData", JSON.stringify(adminData));
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save updated profile data.");
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-12 text-center">Admin Profile</h1>
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-col items-center mb-6">
          <img
            src={adminData.profilePhoto}
            alt="Admin Profile"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <button
            className="text-blue-600 hover:underline"
            onClick={() => alert("Feature to update photo coming soon!")}
          >
            Change Profile Photo
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={adminData.firstName || ""}
              disabled={!isEditing}
              onChange={(e) =>
                setAdminData({ ...adminData, firstName: e.target.value })
              }
              className={`w-full mt-1 p-2 border rounded ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={adminData.lastName || ""}
              disabled={!isEditing}
              onChange={(e) =>
                setAdminData({ ...adminData, lastName: e.target.value })
              }
              className={`w-full mt-1 p-2 border rounded ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={adminData.username || ""}
              disabled={!isEditing}
              onChange={(e) =>
                setAdminData({ ...adminData, username: e.target.value })
              }
              className={`w-full mt-1 p-2 border rounded ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={adminData.email || ""}
              disabled={!isEditing}
              onChange={(e) =>
                setAdminData({ ...adminData, email: e.target.value })
              }
              className={`w-full mt-1 p-2 border rounded ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              value={adminData.role || ""}
              disabled
              className="w-full mt-1 p-2 border rounded border-gray-200 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Status
            </label>
            <input
              type="text"
              value={adminData.isVerified?.status ? "Verified" : "Not Verified"}
              disabled
              className="w-full mt-1 p-2 border rounded border-gray-200 bg-gray-100"
            />
          </div>
        </form>

        <div className="flex justify-end gap-4 mt-6">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setAdminData(originalData); 
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
