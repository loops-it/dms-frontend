"use client";

import Heading from "@/components/common/Heading";
import DashboardLayout from "@/components/DashboardLayout";
import useAuth from "@/hooks/useAuth";
import React, { useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { postWithAuth } from "@/utils/apiClient";
import { IoSave } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import Link from "next/link";
import { Checkbox, Divider } from "antd";


export default function AllDocTable() {
    const [roleName, setRoleName] = useState("");
    const [, setShowToast] = useState(false);
    const [, setToastType] = useState<"success" | "error">("success");
    const [, setToastMessage] = useState("");
    const [error, setError] = useState("");
    const [selectedGroups, setSelectedGroups] = useState<{ [key: string]: string[] }>({});



    const isAuthenticated = useAuth();

    if (!isAuthenticated) {
        return <LoadingSpinner />;
    }

    const allGroups = [
        { name: "Dashboard", items: ["View Dashboard"] },
        { name: "All Documents", items: ["View Documents", "Create Document", "Edit Document", "Delete Document", "Archive Document", "Add Reminder", "Share Document", "Download Document", "Send Email", "Manage Sharable Link"] },
        { name: "Assigned Documents", items: ["Create Document", "Edit Document", "Share Document", "Upload New Version", "Delete Document", "Send Email", "Manage Sharable Link"] },
        { name: "Archived Documents", items: ["View Dashboard", "Restore Document", "Delete Document"] },
        { name: "Deep Search", items: ["Deep Search", "Add Indexing", "Remove Indexing"] },
        { name: "Document Category", items: ["Manage Document Category"] },
        { name: "Document Audit", items: ["View Document Audit Trail"] },
        { name: "User", items: ["View Users", "Create User", "Edit User", "Delete User", "Reset Password", "Assign User Role", "Assign Permission"] },
        { name: "Role", items: ["View Roles", "Create Role", "Edit Role", "Delete Role"] },
        { name: "Email", items: ["Manage SMTP Settings"] },
        { name: "Settings", items: ["Manage Languages", "Storage Settings", "Manage Company Profile"] },
        { name: "Reminder", items: ["View Reminders", "Create Reminder", "Edit Reminder", "Delete Reminder"] },
        { name: "Login Audit", items: ["View Login Audit Logs"] },
        { name: "Page Helpers", items: ["Manage Page Helper"] },
    ];

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const updatedGroups: { [key: string]: string[] } = {};

            allGroups.forEach((group) => {
                updatedGroups[group.name] = group.items;
            });

            setSelectedGroups(updatedGroups);
        } else {
            setSelectedGroups({});
        }
    };

    const handleGroupSelect = (checked: boolean, groupName: string, groupItems: string[]) => {
        setSelectedGroups((prev) => {
            const updatedGroups: { [key: string]: string[] } = { ...prev };

            if (checked) {
                updatedGroups[groupName] = groupItems;
            } else {
                delete updatedGroups[groupName];
            }

            return updatedGroups;
        });
    };

    const handleIndividualSelect = (groupName: string, value: string, checked: boolean) => {
        setSelectedGroups((prev) => {
            const updatedGroups: { [key: string]: string[] } = { ...prev };
            const groupItems = updatedGroups[groupName] || [];

            if (checked) {
                updatedGroups[groupName] = [...groupItems, value];
            } else {
                updatedGroups[groupName] = groupItems.filter((item) => item !== value);

                if (updatedGroups[groupName].length === 0) {
                    delete updatedGroups[groupName];
                }
            }

            return updatedGroups;
        });
    };


    const selectedArray = Object.entries(selectedGroups).map(([group, items]) => ({
        group,
        items,
    }));

    const handleAddRolePermission = async () => {
        if (!roleName.trim()) {
            setError("Role name is required.");
            return;
        }

        setError("");

        try {
            const formData = new FormData();
            formData.append("role_name", roleName);
            formData.append("permissions", JSON.stringify(selectedArray));

            const response = await postWithAuth(`add-role`, formData);

            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }


            if (response.status === "success") {
                console.log("Role added successfully:");
                setToastType("success");
                setToastMessage("Role added successfully!");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
            } else {
                setToastType("error");
                setToastMessage("Error occurred while adding role!");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
            }
        } catch (error) {
            setToastType("error");
            setToastMessage("Error occurred while adding role!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
            console.error("Error adding role:", error);
        }
    };


    return (
        <>
            <DashboardLayout>
                <div className="d-flex justify-content-between align-items-center pt-2">
                    <Heading text="Manage Role" color="#444" />
                </div>
                <div className="d-flex flex-column bg-white p-2 p-lg-3 rounded mt-3">

                    <div className="d-flex flex-column  custom-scroll" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                        <div className="d-flex col-12 col-md-6 flex-column mb-3">
                            <p className="mb-1" style={{ fontSize: "14px" }}>
                                Role Name
                            </p>
                            <div className="input-group mb-1 pe-lg-4">
                                <input
                                    type="text"
                                    className={`form-control ${error ? "is-invalid" : ""}`}
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                />
                            </div>
                            {error && (
                                <div className="text-danger" style={{ fontSize: "12px" }}>
                                    {error}
                                </div>
                            )}
                        </div>

                        <Heading text="Permission" color="#444" />
                        <div className="mt-2">
                            <Checkbox
                                checked={Object.keys(selectedGroups).length === allGroups.length}
                                indeterminate={
                                    Object.keys(selectedGroups).length > 0 && Object.keys(selectedGroups).length < allGroups.length
                                }
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            >
                                Select All
                            </Checkbox>
                            <Divider />

                            {allGroups.map((group, groupIndex) => (
                                <div key={groupIndex} className="mb-4">
                                    <div className="ckeckbox-wrapper mb-2 me-2">
                                        <Checkbox
                                            checked={selectedGroups[group.name]?.length === group.items.length}
                                            indeterminate={
                                                selectedGroups[group.name]?.length > 0 &&
                                                selectedGroups[group.name]?.length < group.items.length
                                            }
                                            onChange={(e) => handleGroupSelect(e.target.checked, group.name, group.items)}
                                        >
                                            {group.name}
                                        </Checkbox>
                                        <div style={{ marginLeft: "20px" }}>
                                            {group.items.map((item, itemIndex) => (
                                                <Checkbox
                                                    key={itemIndex}
                                                    checked={selectedGroups[group.name]?.includes(item)}
                                                    onChange={(e) => handleIndividualSelect(group.name, item, e.target.checked)}
                                                >
                                                    {item}
                                                </Checkbox>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Divider />

                            {/* <pre>{JSON.stringify(selectedArray, null, 2)}</pre> */}
                            <div className="d-flex flex-row"
                            >
                                <button
                                    onClick={() => handleAddRolePermission()}
                                    className="custom-icon-button button-success px-3 py-1 rounded me-2"
                                >
                                    <IoSave fontSize={16} className="me-1" /> Yes
                                </button>
                                <Link
                                    href={"/roles"}
                                    className="custom-icon-button button-danger text-white bg-danger px-3 py-1 rounded"
                                >
                                    <MdOutlineCancel fontSize={16} className="me-1" /> No
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}