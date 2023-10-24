import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from 'react-paginate';
import './ListUser.css';
import 'bootstrap/dist/css/bootstrap.css';

function ListUser() {
    const [users, setUsers] = useState([]);
    const [pageNumber, setPageNumber] = useState(0); // Trang hiện tại
    const usersPerPage = 10; // Số user hiển thị trên mỗi trang
    const pagesVisited = pageNumber * usersPerPage;
    useEffect(() => {
        axios.get("http://localhost:8080/account/users")
            .then(res => {
                setUsers(res.data);
                console.log(res.data)
            })
            .catch(function (err) {
                console.log(err)
            })
    }, []);

    const displayUsers = users
        .slice(pagesVisited, pagesVisited + usersPerPage)
        .map((user) => {
            const statusColor = user.status === "Active" ? "backgroundColorStatusActive" : "backgroundColorStatusBlocked";
            console.log(users)
            console.log(user)
            console.log(user.status)
            return (
                <tr key={user.id}>
                    <td>{user.avatar == null ? <p className="text-danger">Not update</p> :
                        <img src={user.avatar} height={'150px'}/>}</td>
                    <td>{user.name == null ? <p className="text-danger">Not update</p> : <p>{user.name}</p>}</td>
                    <td>{user.username}</td>
                    <td>{user.password}</td>
                    <td><p className={statusColor}>{user.status}</p></td>
                    <td>
                        <i
                            style={{cursor: "pointer", fontSize: "30px", fontWeight: "bold"}}
                            className={
                                user.status === "Active"
                                    ? "fa fa-unlock"
                                    : "fa fa-lock"
                            }
                            onClick={() => handleUserStatusClick(user.id)}
                        ></i>
                    </td>
                </tr>
            );
        });

    const pageCount = Math.ceil(users.length / usersPerPage);

    const changePage = ({selected}) => {
        setPageNumber(selected);
    };

    const handleUserStatusClick = (userId) => {
        const updatedUsers = users.map((user) => {
            if (user.id === userId) {
                const newStatus = user.status === "Active" ? "Blocked" : "Active";
                return {
                    ...user,
                    status: newStatus
                }
            }
            return user;

        });
        setUsers(updatedUsers);
        updateUserStatus(userId);
    };

    const updateUserStatus = (userId) => {
        const updatedAccount = users.find((user) => user.id === userId);
        updatedAccount.status = updatedAccount.status === "Active" ? "Blocked" : "Active";
        if (updatedAccount.status === "Blocked") {
            Swal.fire({
                icon: 'warning',
                title: 'Lock!',
                showConfirmButton: false, // Ẩn nút "OK"
                timer: 1000 // Tự động đóng cửa sổ thông báo sau 1 giây (tuỳ chỉnh theo ý muốn)
            });
        }
        if (updatedAccount.status === "Active") {
            Swal.fire({
                icon: 'success',
                title: 'Unlock',
                showConfirmButton: false, // Ẩn nút "OK"
                timer: 1000 // Tự động đóng cửa sổ thông báo sau 1 giây (tuỳ chỉnh theo ý muốn)
            });
        }
        axios.post(`http://localhost:8080/account/editAccount`, updatedAccount)
            .then((res) => {
                console.log("Updated Account success")
            })
            .catch((err) => {
                console.log("Error updating user status:", err);
            });
    };

    return (
        <>
            <div className="container">
                <h4 className='text-center pb-20 mt-20'>List user</h4>
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {displayUsers}
                    </tbody>
                </table>
                {/* Phân trang */}
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__link"}
                    nextLinkClassName={"pagination__link"}
                    disabledClassName={"pagination__link--disabled"}
                    activeClassName={"pagination__link--active"}
                    pageLinkClassName={"pagination__link--number"}
                    pageClassName={"pagination__item"}

                />
            </div>

        </>
    )
}

export default ListUser;