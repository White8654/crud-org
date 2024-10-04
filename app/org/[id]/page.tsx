"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { OrgItem, getOrg } from "@/actions/orgItem"; 
import { updateOrg } from "@/actions/updateTodo";
import { deleteOrg } from "@/actions/deleteTodo";
import { FiEdit, FiTrash2 } from "react-icons/fi"; 
import { AiOutlineSync } from "react-icons/ai"; 

interface AuthResult {
  device_code?: string;
  verification_url?: string;
  message?: string;
}

export default function OrgDetails() {
  const { id } = useParams(); 
  const router = useRouter(); 
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
  const [hasChanges, setHasChanges] = useState(false);
  const [authResult, setAuthResult] = useState<AuthResult | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showIframe, setShowIframe] = useState(false); // State for iframe visibility

  useEffect(() => {
    if (id) {
      const loadOrgData = async () => {
        try {
          setLoading(true);
          const orgData = await getOrg(Number(id));
          setOrg(orgData);
          setEditedOrg(orgData);
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
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    if (editedOrg) {
      try {
        await updateOrg(editedOrg);
        setOrg(editedOrg);
        setHasChanges(false);
        setIsEditing({ orgName: false, Type: false, Status: false, Active: false });
      } catch (error) {
        setError("Failed to save changes.");
      }
    }
  };

  const handleCancel = () => {
    setEditedOrg(org);
    setHasChanges(false);
    setIsEditing({ orgName: false, Type: false, Status: false, Active: false });
  };

  const handleDelete = async () => {
    if (org) {
      try {
        await deleteOrg(org.id);
        router.push('/'); 
      } catch (error) {
        setError("Failed to delete organization.");
      }
    }
  };

  const handleAuthenticate = async () => {
    if (org) {
      setIsAuthLoading(true);
      setAuthResult(null);
      try {
        const alias = org.orgName.replace(/\s/g, '_');
        const response = await fetch('/api/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ alias }),
        });
  
        if (response.ok) {
          const [result] = await response.json();
          setAuthResult(result);
          if (result.verification_url) {
            setShowIframe(true); // Show iframe when authentication result is received
          }
        } else {
          const errorData = await response.json();
          setAuthResult({ message: errorData.message || 'Failed to authenticate.' });
        }
      } catch (error) {
        setAuthResult({ message: 'Failed to authenticate.' });
      } finally {
        setIsAuthLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="loader"></div> 
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <main className="bg-gradient-to-r from-gray-50 to-gray-200 w-full min-h-screen text-black p-5 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl mx-auto p-8 rounded-lg shadow-lg border border-gray-300">
        {org ? (
          <>
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">Organization Details</h1>
              <div className="flex items-center">
                <FiTrash2 
                  className="ml-4 cursor-pointer text-red-500 hover:text-red-700 transition duration-200"
                  onClick={handleDelete}
                  title="Delete Organization"
                />
                <button 
                  onClick={handleAuthenticate}
                  className="ml-4 bg-green-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-green-600 flex items-center"
                  disabled={isAuthLoading}
                >
                  {isAuthLoading ? (
                    <div className="loader"></div>
                  ) : (
                    <>
                      <AiOutlineSync className="mr-2" />
                      Authenticate
                    </>
                  )}
                </button>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Organization Name:</span>
                  <div className="flex items-center">
                    {isEditing.orgName ? (
                      <input
                        type="text"
                        value={editedOrg?.orgName || ''}
                        onChange={(e) => handleEditField('orgName', e.target.value)}
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
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

                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold text-gray-700">Type:</span>
                  <div className="flex items-center">
                    {isEditing.Type ? (
                      <select
                        value={editedOrg?.Type || '--None--'}
                        onChange={(e) => handleEditField('Type', e.target.value)}
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
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
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <div className="flex items-center">
                    {isEditing.Status ? (
                      <select
                        value={editedOrg?.Status || '--None--'}
                        onChange={(e) => handleEditField('Status', e.target.value)}
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
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

                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold text-gray-700">Active:</span>
                  <div className="flex items-center">
                    {isEditing.Active ? (
                      <select
                        value={editedOrg?.Active ? "true" : "false"}
                        onChange={(e) => handleEditField('Active', e.target.value === "true")}
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    ) : (
                      <span className="text-gray-600">{org.Active ? 'Yes' : 'No'}</span>
                    )}
                    <FiEdit
                      className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
                      onClick={() => setIsEditing({ ...isEditing, Active: !isEditing.Active })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-start items-center mt-6">
              <span className="font-semibold text-gray-700 mr-2">Last Updated:</span>
              <span className="text-gray-600">{new Date(org.LastUpdated).toLocaleString()}</span>
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

            {/* Authentication Result Section */}
            <div className="mt-8 p-4 border-t border-gray-200">
              {isAuthLoading ? (
                <div className="flex justify-center items-center">
                  <div className="loader"></div>
                  <span className="ml-2 text-gray-600">Authenticating...</span>
                </div>
              ) : (
                authResult && (
                  <div className="text-center text-gray-700 font-semibold">
                    {authResult.device_code && (
                      <div>
                        <p>Device Code: <span className="text-black font-bold">{authResult.device_code}</span></p>
                        {/* <p>Verification URL: 
                          <a href={authResult.verification_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-2">
                            {authResult.verification_url}
                          </a>
                        </p> */}
                      </div>
                    )}
                    {authResult.message && !authResult.device_code && (
                      <p>{authResult.message}</p>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Iframe for Verification URL */}
            {/* Iframe for Verification URL */}
{showIframe && authResult?.verification_url && (
  <div className="mt-8 border-t border-gray-200 pt-4">
    <h2 className="text-xl font-semibold mb-4">Verification</h2>
    <div className="overflow-hidden" style={{ width: '100%', height: '600px', position: 'relative' }}>
      <iframe
        src={authResult.verification_url}
        title="Verification"
        className="absolute top-0 left-0 w-full h-full"
        style={{ transform: 'scale(1)', transformOrigin: '0 0', border: 'none' }}
      />
    </div>
  </div>
)}

          </>
        ) : (
          <div className="text-center text-gray-600">Organization not found</div>
        )}
      </div>
    </main>
  );
}
