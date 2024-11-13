"use client";

import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import DashboardLayout from "@/components/DashboardLayout";
import React, { useState } from "react";
import {
  Dropdown,
  DropdownButton,
  Form,
  Pagination,
  Table,
} from "react-bootstrap";
import { AiOutlineZoomOut, AiFillDelete } from "react-icons/ai";
import { BiSolidCommentDetail } from "react-icons/bi";
import { BsBellFill } from "react-icons/bs";
import { FaArchive, FaEllipsisV } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { GoHistory } from "react-icons/go";
import { IoEye, IoShareSocial } from "react-icons/io5";
import { MdModeEditOutline, MdOutlineInsertLink, MdFileDownload, MdUpload, MdEmail } from "react-icons/md";

interface TableItem {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
}
const dummyData: TableItem[] = Array.from({ length: 45 }, (_, index) => ({
  id: index + 1,
  email: `test${index + 1}@gmail.com`,
  firstName: `jhon${index + 1}`,
  lastName: `doe${index + 1}`,
  mobileNumber: "0710000000",
}));

export default function AllDocTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const totalItems = dummyData.length;
  const totalPages = Math.ceil(dummyData.length / itemsPerPage);

    // ================================================================
  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // ================================================================
  // Change items per page
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const paginatedData = dummyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddUser = () => {
    console.log("add user clicked")
  };

  return (
    <>
      <DashboardLayout>
        <div className="d-flex justify-content-between align-items-center pt-2">
          <Heading text="Users" color="#444" />
          <button onClick={handleAddUser} className="addButton bg-white text-dark border border-success rounded px-3 py-1">
            <FaPlus /> Add User
          </button>
        </div>

        <div className="d-flex flex-column bg-white p-2 p-lg-3 rounded mt-3">
          <div>
            {/* Scrollable Table Container */}
            <div
              style={{ maxHeight: "380px", overflowY: "auto" }}
              className="custom-scroll"
            >
              <Table hover>
                <thead>
                  <tr>
                    <th>Actions</th>
                    <th className="text-start">Email</th>
                    <th className="text-start">First Name</th>
                    <th className="text-start">Last Name</th>
                    <th className="text-start">Mobile Number</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr key={item.id}>
                        <td>
                        <DropdownButton
                            id="dropdown-basic-button"
                            drop="end"
                            title={<FaEllipsisV />}
                            className="no-caret"
                          >
                            <Dropdown.Item href="#" className="py-2">
                              <IoEye className="me-2" />
                              View
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className="py-2">
                              <MdModeEditOutline className="me-2" />
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className="py-2">
                              <IoShareSocial className="me-2" />
                              Share
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className="py-2">
                              <MdOutlineInsertLink className="me-2" />
                              Get Shareable Link
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className="py-2">
                              <MdFileDownload className="me-2" />
                              Download
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className="py-2">
                              <MdUpload className="me-2" />
                              Upload New Version file
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className="py-2">
                              <GoHistory className="me-2" />
                              Version History
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className="py-2">
                              <BiSolidCommentDetail className="me-2" />
                              Comment
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className="py-2">
                              <BsBellFill className="me-2" />
                              Add Reminder
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className="py-2">
                              <MdEmail className="me-2" />
                              Send Email
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className="py-2">
                              <AiOutlineZoomOut className="me-2" />
                              Remove Indexing
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className="py-2">
                              <FaArchive className="me-2" />
                              Archive
                            </Dropdown.Item>
                            <Dropdown.Item href="#" className="py-2">
                              <AiFillDelete className="me-2" />
                              Delete
                            </Dropdown.Item>
                          </DropdownButton>
                        </td>
                        <td>{item.email}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.mobileNumber}</td>
                      </tr>
                    ))
                  ) : (
                    <div className="text-start w-100 py-3">
                      <Paragraph text="No data available" color="#333" />
                    </div>
                  )}
                </tbody>
              </Table>
            </div>

            <div className="d-flex flex-column flex-lg-row paginationFooter">
              <div className="d-flex justify-content-between align-items-center">
                <p className="pagintionText mb-0 me-2">Items per page:</p>
                <Form.Select
                  onChange={handleItemsPerPageChange}
                  value={itemsPerPage}
                  style={{ width: "100px", padding: "5px 10px !important", fontSize: "12px" }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </Form.Select>
              </div>
              <div className="d-flex flex-row align-items-center px-lg-5">
                <div className="pagination-info" style={{ fontSize: "14px" }}>
                  {startIndex} – {endIndex} of {totalItems}
                </div>

                <Pagination className="ms-3">
                  <Pagination.Prev
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Next
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
