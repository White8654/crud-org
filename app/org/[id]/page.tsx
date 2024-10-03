"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { OrgItem, getOrg } from "@/actions/orgItem"; 
import { updateOrg } from "@/actions/updateTodo";
import { deleteOrg } from "@/actions/deleteTodo";
import { FiEdit } from "react-icons/fi"; // Importing the edit icon from react-icons

export default function OrgDetails() {
  const { id } = useParams(); 
  const router = useRouter(); // Initialize the router for navigation
  const [org, setOrg] = useState<OrgItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({
    orgName: false,
    Type: false,
    Status: false,
    Active: false,
  });
  const [editedOrg, setEditedOrg] = useState<OrgItem | null>(null);
  const [hasChanges, setHasChanges] = useState(false); // Track if there are unsaved changes

  useEffect(() => {
    if (id) {
      const loadOrgData = async () => {
        try {
          setLoading(true);
          const orgData = await getOrg(Number(id));
          setOrg(orgData);
          setEditedOrg(orgData); // Set initial edited org to current org data
        } catch (error) {
          setError("Failed to load organization details.");
        } finally {
          setLoading(false);
        }
      };

      loadOrgData();
    }
  }, [id]);

  const handleEditField = (field: keyof OrgItem, value: any) => {
    if (editedOrg) {
      const updatedOrg = { ...editedOrg, [field]: value };
      setEditedOrg(updatedOrg);
      setHasChanges(true); // Mark that there are changes
    }
  };

  const handleSave = async () => {
    if (editedOrg) {
      try {
        await updateOrg(editedOrg); // Update the organization
        setOrg(editedOrg); // Update the displayed org
        setHasChanges(false); // Reset changes tracking
        setIsEditing({ orgName: false, Type: false, Status: false, Active: false }); // Disable all editing
      } catch (error) {
        setError("Failed to save changes.");
      }
    }
  };

  const handleCancel = () => {
    setEditedOrg(org); // Revert to the original org data
    setHasChanges(false); // Reset changes tracking
    setIsEditing({ orgName: false, Type: false, Status: false, Active: false }); // Disable all editing
  };

  const handleDelete = async () => {
    if (org) {
      try {
        await deleteOrg(org.id);
        router.push('/'); // Redirect to home page after deletion
      } catch (error) {
        setError("Failed to delete organization.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="loader"></div> {/* Spinner component */}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <main className="bg-gradient-to-r from-gray-100 to-gray-300 w-full min-h-screen text-black p-5 flex items-center justify-center">
      <div className="bg-white w-4/5 max-w-lg mx-auto p-6 rounded-lg shadow-lg border border-gray-200 transition duration-500 ease-in-out transform hover:shadow-xl">
        {org ? (
          <>
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Organization Details</h1>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Organization Name:</span>
                <div className="flex items-center">
                  {isEditing.orgName ? (
                    <input
                      type="text"
                      value={editedOrg?.orgName || ''} // Use optional chaining
                      onChange={(e) => handleEditField('orgName', e.target.value)}
                      className="border border-gray-300 rounded p-2 transition duration-300 ease-in-out focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <span className="text-gray-600">{org.orgName}</span>
                  )}
                  <FiEdit
                    className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
                    onClick={() => setIsEditing({ ...isEditing, orgName: !isEditing.orgName })}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Type:</span>
                <div className="flex items-center">
                  {isEditing.Type ? (
                    <select
                      value={editedOrg?.Type || '--None--'} // Use optional chaining
                      onChange={(e) => handleEditField('Type', e.target.value)}
                      className="border border-gray-300 rounded p-2 transition duration-300 ease-in-out focus:outline-none focus:border-blue-500"
                    >
                      <option value="--None--">--None--</option>
                      <option value="Sandbox">Sandbox</option>
                      <option value="Production">Production</option>
                    </select>
                  ) : (
                    <span className="text-gray-600">{org.Type}</span>
                  )}
                  <FiEdit
                    className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
                    onClick={() => setIsEditing({ ...isEditing, Type: !isEditing.Type })}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Status:</span>
                <div className="flex items-center">
                  {isEditing.Status ? (
                    <select
                      value={editedOrg?.Status || '--None--'} // Use optional chaining
                      onChange={(e) => handleEditField('Status', e.target.value)}
                      className="border border-gray-300 rounded p-2 transition duration-300 ease-in-out focus:outline-none focus:border-blue-500"
                    >
                      <option value="--None--">--None--</option>
                      <option value="New">New</option>
                      <option value="Authenticated">Authenticated</option>
                      <option value="Auth-Expired">Auth-Expired</option>
                    </select>
                  ) : (
                    <span className="text-gray-600">{org.Status}</span>
                  )}
                  <FiEdit
                    className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
                    onClick={() => setIsEditing({ ...isEditing, Status: !isEditing.Status })}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Active:</span>
                <div className="flex items-center">
                  {isEditing.Active ? (
                    <select
                      value={editedOrg?.Active ? "true" : "false"} // Use optional chaining
                      onChange={(e) => handleEditField('Active', e.target.value === "true")}
                      className="border border-gray-300 rounded p-2 transition duration-300 ease-in-out focus:outline-none focus:border-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : (
                    <span className="text-gray-600">{org.Active ? "Yes" : "No"}</span>
                  )}
                  <FiEdit
                    className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
                    onClick={() => setIsEditing({ ...isEditing, Active: !isEditing.Active })}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Last Updated:</span>
                <span className="text-gray-600">{new Date(org.LastUpdated).toLocaleString()}</span>
              </div>
            </div>

            {/* Save and Cancel buttons */}
            {hasChanges && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white rounded px-4 py-2 transition duration-300 ease-in-out hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-black rounded px-4 py-2 transition duration-300 ease-in-out hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white rounded px-4 py-2 transition duration-300 ease-in-out hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600">Organization not found</div>
        )}
      </div>
    </main>
  );
}
