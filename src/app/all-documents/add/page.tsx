"use client";

import Heading from "@/components/common/Heading";
import DashboardLayout from "@/components/DashboardLayout";
import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { postWithAuth } from "@/utils/apiClient";
import { IoAdd, IoClose, IoSaveOutline, IoTrashOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { useUserContext } from "@/context/userContext";
import { formatDateForSQL } from "@/utils/commonFunctions";
import {
  fetchAndMapUserData,
  fetchCategoryData,
  fetchRoleData,
} from "@/utils/dataFetchFunctions";
import {
  CategoryDropdownItem,
  RoleDropdownItem,
  UserDropdownItem,
} from "@/types/types";

export default function AllDocTable() {
  const isAuthenticated = useAuth();
  const { userId } = useUserContext();

  console.log("user id: ", userId);

  const [name, setName] = useState<string>("");
  const [document, setDocument] = useState<File | null>(null);
  const [storage, setStorage] = useState<string>("Local Disk (Default)");
  const [roleDropDownData, setRoleDropDownData] = useState<RoleDropdownItem[]>(
    []
  );
  const [userDropDownData, setUserDropDownData] = useState<UserDropdownItem[]>(
    []
  );

  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const [metaTags, setMetaTags] = useState<string[]>([]);
  const [currentMeta, setCurrentMeta] = useState<string>("");

  const [isTimeLimited, setIsTimeLimited] = useState<boolean>(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [downloadable, setDownloadable] = useState<boolean>(false);

  const [isUserTimeLimited, setIsUserTimeLimited] = useState<boolean>(false);
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userStartDate, setUserStartDate] = useState<string>("");
  const [userEndDate, setUserEndDate] = useState<string>("");
  const [userDownloadable, setUserDownloadable] = useState<boolean>(false);

  const [categoryDropDownData, setCategoryDropDownData] = useState<
    CategoryDropdownItem[]
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string) => {
    let message = "";
    if (field === "name" && !value) {
      message = "Name is required.";
    } else if (field === "document" && !document) {
      message = "Document is required.";
    } else if (field === "startDate" && isTimeLimited && !value) {
      message = "Start date is required.";
    } else if (field === "endDate" && isTimeLimited && !value) {
      message = "End date is required.";
    } else if (field === "userStartDate" && isUserTimeLimited && !value) {
      message = "User start date is required.";
    } else if (field === "userEndDate" && isUserTimeLimited && !value) {
      message = "User end date is required.";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: message }));
  };

  const handleBlur = (field: string, value: string) => {
    validateField(field, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocument(file);
    if (file) {
      setErrors((prevErrors) => ({ ...prevErrors, document: "" }));
    }
  };

  useEffect(() => {
    fetchCategoryData(setCategoryDropDownData);
    fetchRoleData(setRoleDropDownData);
    fetchAndMapUserData(setUserDropDownData);
  }, []);

  useEffect(() => {
    // console.log("dropdown updated:", userDropDownData);
  }, [userDropDownData, roleDropDownData, categoryDropDownData]);

  // category select
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  // meta tag
  const addMetaTag = () => {
    if (currentMeta.trim() !== "" && !metaTags.includes(currentMeta.trim())) {
      setMetaTags((prev) => [...prev, currentMeta.trim()]);
      setCurrentMeta("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addMetaTag();
    }
  };

  const updateMetaTag = (index: number, value: string) => {
    setMetaTags((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const removeMetaTag = (index: number) => {
    setMetaTags((prev) => prev.filter((_, i) => i !== index));
  };

  // role select
  const handleRoleSelect = (roleId: string) => {
    const selectedRole = roleDropDownData.find(
      (role) => role.id.toString() === roleId
    );

    if (selectedRole && !selectedRoleIds.includes(roleId)) {
      setSelectedRoleIds([...selectedRoleIds, roleId]);
      setRoles([...roles, selectedRole.role_name]);
    }
  };

  const handleRemoveRole = (roleName: string) => {
    const roleToRemove = roleDropDownData.find(
      (role) => role.role_name === roleName
    );

    if (roleToRemove) {
      setSelectedRoleIds(
        selectedRoleIds.filter((id) => id !== roleToRemove.id.toString())
      );
      setRoles(roles.filter((r) => r !== roleName));
    }
  };

  // user select
  const handleUserSelect = (userId: string) => {
    const selectedUser = userDropDownData.find(
      (user) => user.id.toString() === userId
    );

    if (selectedUser && !selectedUserIds.includes(userId)) {
      setSelectedUserIds([...selectedUserIds, userId]);
      setUsers([...users, selectedUser.user_name]);
    }
  };

  const handleUserRole = (userName: string) => {
    const userToRemove = userDropDownData.find(
      (user) => user.user_name === userName
    );

    if (userToRemove) {
      setSelectedUserIds(
        selectedUserIds.filter((id) => id !== userToRemove.id.toString())
      );
      setUsers(users.filter((r) => r !== userName));
    }
  };

  const collectedData = {
    isTimeLimited: isTimeLimited ? "1" : "0",
    selectedRoleIds: selectedRoleIds.join(","),
    startDate: formatDateForSQL(startDate),
    endDate: formatDateForSQL(endDate),
    downloadable: downloadable ? "1" : "0",
    isUserTimeLimited: isUserTimeLimited ? "1" : "0",
    selectedUserIds: selectedUserIds.join(","),
    userStartDate: formatDateForSQL(userStartDate),
    userEndDate: formatDateForSQL(userEndDate),
    userDownloadable: userDownloadable ? "1" : "0",
  };

  console.log("Collected Data:", collectedData);

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("document", document || "");
    formData.append("category", selectedCategoryId);
    formData.append("storage", storage);
    formData.append("description", description);
    formData.append("meta_tags[]", JSON.stringify(metaTags));
    formData.append("assigned_roles[]", collectedData.selectedRoleIds);
    formData.append("role_is_time_limited", collectedData.isTimeLimited);
    formData.append("role_start_date_time", collectedData.startDate);
    formData.append("role_end_date_time", collectedData.endDate);
    formData.append("role_is_downloadable", collectedData.downloadable);
    formData.append("assigned_users[]", collectedData.selectedRoleIds);
    formData.append("user_is_time_limited", collectedData.isUserTimeLimited);
    formData.append("user_start_date_time", collectedData.userStartDate);
    formData.append("user_end_date_time", collectedData.userEndDate);
    formData.append("user_is_downloadable", collectedData.userDownloadable);
    formData.append("user", userId || "");

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    setLoading(true);
    setError("");

    try {
      const response = await postWithAuth("add-document", formData);
      console.log("Form submitted successfully:", response);
      setSuccess("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className="d-flex justify-content-between align-items-center pt-2">
          <Heading text="Add Document" color="#444" />
        </div>

        <div className="d-flex flex-column bg-white p-2 p-lg-3 rounded mt-3">
          <div
            style={{
              maxHeight: "380px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            className="custom-scroll"
          >
            <div className="d-flex flex-column">
              <div className="row row-cols-1 row-cols-lg-4 d-flex justify-content-around px-lg-3 mb-lg-3">
                <div className="col d-flex flex-column  justify-content-center align-items-center p-0">
                  <p
                    className="mb-1 text-start w-100"
                    style={{ fontSize: "14px" }}
                  >
                    Document
                  </p>
                  <input
                    type="file"
                    id="document"
                    accept=".pdf,.doc,.docx,.png,.jpg"
                    onChange={handleFileChange}
                    onBlur={() =>
                      handleBlur("document", document ? "valid" : "")
                    }
                    required
                  />
                  {errors.document && (
                    <span className="text-danger">{errors.document}</span>
                  )}
                </div>
                <div className="col d-flex flex-column justify-content-center align-items-center p-0 ps-lg-2">
                  <p
                    className="mb-1 text-start w-100"
                    style={{ fontSize: "14px" }}
                  >
                    Name
                  </p>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur("name", name)}
                  />
                  {errors.name && (
                    <span className="text-danger">{errors.name}</span>
                  )}
                </div>

                <div className="col d-flex flex-column justify-content-center align-items-center p-0 ps-lg-2">
                  <p
                    className="mb-1 text-start w-100"
                    style={{ fontSize: "14px" }}
                  >
                    Category
                  </p>
                  <DropdownButton
                    id="dropdown-category-button"
                    title={
                      selectedCategoryId
                        ? categoryDropDownData.find(
                            (item) => item.id.toString() === selectedCategoryId
                          )?.category_name
                        : "Select Category"
                    }
                    className="custom-dropdown-text-start text-start w-100"
                    onSelect={(value) => handleCategorySelect(value || "")}
                  >
                    {categoryDropDownData.map((category) => (
                      <Dropdown.Item
                        key={category.id}
                        eventKey={category.id.toString()}
                        style={{
                          fontWeight:
                            category.parent_category === "none"
                              ? "bold"
                              : "normal",
                          marginLeft:
                            category.parent_category === "none"
                              ? "0px"
                              : "20px",
                        }}
                      >
                        {category.category_name}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </div>
                <div className="col d-flex flex-column justify-content-center align-items-center p-0 ps-lg-2">
                  <p
                    className="mb-1 text-start w-100"
                    style={{ fontSize: "14px" }}
                  >
                    Storage
                  </p>
                  <DropdownButton
                    id="dropdown-category-button"
                    title={storage}
                    className="custom-dropdown-text-start text-start w-100"
                    onSelect={(value) => setStorage(value || "")}
                  >
                    <Dropdown.Item eventKey="Local Disk (Default)">
                      Local Disk (Default)
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
              </div>
              <div className="d-flex flex-column flex-lg-row mb-3">
                <div className="col-12 col-lg-6 d-flex flex-column">
                  <p
                    className="mb-1 text-start w-100"
                    style={{ fontSize: "14px" }}
                  >
                    Description
                  </p>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="col-12 col-lg-6 d-flex flex-column ps-lg-2">
                  <p
                    className="mb-1 text-start w-100"
                    style={{ fontSize: "14px" }}
                  >
                    Meta tags
                  </p>
                  <div className="col-12">
                    <div
                      style={{ marginBottom: "10px" }}
                      className="w-100 d-flex"
                    >
                      <input
                        type="text"
                        value={currentMeta}
                        onChange={(e) => setCurrentMeta(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a meta tag"
                        style={{
                          flex: 1,
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderTopRightRadius: "0",
                          borderBottomRightRadius: "0",
                        }}
                      />
                      <button
                        onClick={addMetaTag}
                        className="successButton"
                        style={{
                          padding: "10px",
                          backgroundColor: "#4CAF50",
                          color: "white",
                          border: "1px solid #4CAF50",
                          borderLeft: "none",
                          borderTopRightRadius: "4px",
                          borderBottomRightRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <IoAdd />
                      </button>
                    </div>
                    <div>
                      {metaTags.map((tag, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "5px",
                          }}
                        >
                          <input
                            type="text"
                            value={tag}
                            onChange={(e) =>
                              updateMetaTag(index, e.target.value)
                            }
                            style={{
                              flex: 1,
                              padding: "10px",
                              borderRadius: "0px",
                            }}
                          />
                          <button
                            onClick={() => removeMetaTag(index)}
                            className="dangerButton"
                            style={{
                              padding: "10px",
                              backgroundColor: "#f44336",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            <IoTrashOutline />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column flex-lg-row">
                <div className="col-12 col-lg-6 d-flex flex-column">
                  <p
                    className="mb-1 text-start w-100"
                    style={{ fontSize: "14px" }}
                  >
                    Assign/share with roles
                  </p>
                  <div className="d-flex flex-column position-relative">
                    <DropdownButton
                      id="dropdown-category-button"
                      title={
                        roles.length > 0 ? roles.join(", ") : "Select Roles"
                      }
                      className="custom-dropdown-text-start text-start w-100"
                      onSelect={(value) => {
                        if (value) handleRoleSelect(value);
                      }}
                    >
                      {roleDropDownData.length > 0 ? (
                        roleDropDownData.map((role) => (
                          <Dropdown.Item key={role.id} eventKey={role.id}>
                            {role.role_name}
                          </Dropdown.Item>
                        ))
                      ) : (
                        <Dropdown.Item disabled>
                          No Roles available
                        </Dropdown.Item>
                      )}
                    </DropdownButton>

                    <div className="mt-1">
                      {roles.map((role, index) => (
                        <span
                          key={index}
                          className="badge bg-primary text-light me-2 p-2 d-inline-flex align-items-center"
                        >
                          {role}
                          <IoClose
                            className="ms-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleRemoveRole(role)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  {roles.length > 0 && (
                    <div className="mt-1">
                      <label className="d-flex flex-row mt-2">
                        <input
                          type="checkbox"
                          checked={isTimeLimited}
                          onChange={() => setIsTimeLimited(!isTimeLimited)}
                          className="me-2"
                        />
                        <p
                          className="mb-1 text-start w-100"
                          style={{ fontSize: "14px" }}
                        >
                          Specify the Period
                        </p>
                      </label>
                      {isTimeLimited && (
                        <div className="d-flex flex-column flex-lg-row gap-2">
                          <div className="d-flex flex-column">
                            <label className="d-block">
                              <input
                                type="datetime-local"
                                placeholder="Choose a Start Date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                onBlur={() =>
                                  handleBlur("startDate", startDate)
                                }
                                className="form-control"
                              />
                            </label>
                            {errors.startDate && (
                              <span className="text-danger">
                                {errors.startDate}
                              </span>
                            )}
                          </div>
                          <div className="d-flex flex-column">
                            <label className="d-block">
                              <input
                                type="datetime-local"
                                placeholder="Choose a End Date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                onBlur={() => handleBlur("endDate", endDate)}
                                className="form-control"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                      <label className="d-flex flex-row mt-2">
                        <input
                          type="checkbox"
                          checked={downloadable}
                          onChange={() => setDownloadable(!downloadable)}
                          className="me-2"
                        />
                        <p
                          className="mb-1 text-start w-100"
                          style={{ fontSize: "14px" }}
                        >
                          Downloadable
                        </p>
                      </label>
                    </div>
                  )}
                </div>

                <div className="col-12 col-lg-6 d-flex flex-column ps-lg-2">
                  <p
                    className="mb-1 text-start w-100"
                    style={{ fontSize: "14px" }}
                  >
                    Assign/share with Users
                  </p>
                  <div className="d-flex flex-column position-relative">
                    <DropdownButton
                      id="dropdown-category-button-2"
                      title={
                        users.length > 0 ? users.join(", ") : "Select Users"
                      }
                      className="custom-dropdown-text-start text-start w-100"
                      onSelect={(value) => {
                        if (value) handleUserSelect(value);
                      }}
                    >
                      {userDropDownData.length > 0 ? (
                        userDropDownData.map((user) => (
                          <Dropdown.Item key={user.id} eventKey={user.id}>
                            {user.user_name}
                          </Dropdown.Item>
                        ))
                      ) : (
                        <Dropdown.Item disabled>
                          No users available
                        </Dropdown.Item>
                      )}
                    </DropdownButton>

                    <div className="mt-1">
                      {users.map((user, index) => (
                        <span
                          key={index}
                          className="badge bg-primary text-light me-2 p-2 d-inline-flex align-items-center"
                        >
                          {user}
                          <IoClose
                            className="ms-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleUserRole(user)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedUserIds.length > 0 && (
                    <div className="mt-1">
                      <label className="d-flex flex-row mt-2">
                        <input
                          type="checkbox"
                          checked={isUserTimeLimited}
                          onChange={() =>
                            setIsUserTimeLimited(!isUserTimeLimited)
                          }
                          className="me-2"
                        />
                        <p
                          className="mb-1 text-start w-100"
                          style={{ fontSize: "14px" }}
                        >
                          Specify the Period
                        </p>
                      </label>
                      {isUserTimeLimited && (
                        <div className="d-flex flex-column flex-lg-row gap-2">
                          <div className="d-flex flex-column">
                            <label className="d-block">
                              <input
                                type="datetime-local"
                                placeholder="Choose a Start Date"
                                value={userStartDate}
                                onChange={(e) =>
                                  setUserStartDate(e.target.value)
                                }
                                onBlur={() =>
                                  handleBlur("userStartDate", userStartDate)
                                }
                                className="form-control"
                              />
                              {errors.userStartDate && (
                                <span className="text-danger">
                                  {errors.userStartDate}
                                </span>
                              )}
                            </label>
                          </div>
                          <div className="d-flex flex-column">
                            <label className="d-block">
                              <input
                                type="datetime-local"
                                placeholder="Choose a End Date"
                                value={userEndDate}
                                onChange={(e) => setUserEndDate(e.target.value)}
                                onBlur={() =>
                                  handleBlur("userEndDate", userEndDate)
                                }
                                className="form-control"
                              />
                            </label>
                            {errors.userEndDate && (
                              <span className="text-danger">
                                {errors.userEndDate}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <label className="d-flex flex-row mt-2">
                        <input
                          type="checkbox"
                          checked={userDownloadable}
                          onChange={() =>
                            setUserDownloadable(!userDownloadable)
                          }
                          className="me-2"
                        />
                        <p
                          className="mb-1 text-start w-100"
                          style={{ fontSize: "14px" }}
                        >
                          Downloadable
                        </p>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <div className="d-flex flex-row mt-5">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="custom-icon-button button-success px-3 py-1 rounded me-2"
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <IoSaveOutline fontSize={16} className="me-1" /> Save
                </>
              )}
            </button>
            <a
              href="/all-documents"
              className="custom-icon-button button-danger text-white bg-danger px-3 py-1 rounded"
            >
              <MdOutlineCancel fontSize={16} className="me-1" /> Cancel
            </a>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}