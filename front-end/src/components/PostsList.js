import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewPostForm from "./PostsNew";
import FilterPosts from "./PostsFilter";
import PostLikeButton from "./PostLikeButton";
import useCsrfToken from "../hooks/useCsrfToken";
import AlertModal from "./AlertModal";
import { useAuthContext } from "../contexts/AuthContext";
import ShowTrail from "./TrailShow";

function ListPosts() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [postSuccess, setPostSuccess] = useState(false);
    const [tagsList, setTagsList] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const { user } = useAuthContext();
    const csrfToken = useCsrfToken();
    const [trailSuccess, setTrailSuccess] = useState(false);
    const [savedTrails, setSavedTrails] = useState([]);
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = isProduction
        ? ""
        : process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch posts
                const postsUrl = `${baseUrl}/content/posts/?page=${currentPage}`;
                const postsResponse = await fetch(postsUrl);
                if (postsResponse.ok) {
                    const postsData = await postsResponse.json();
                    setPosts(postsData.results.reverse());
                    setTotalPages(postsData.total_pages);
                } else {
                    console.error("Failed to fetch posts");
                }

                // Fetch saved trails
                if (user) {
                    const savedTrailsUrl = `${baseUrl}/trails/saved_trails/`;
                    const savedTrailsResponse = await fetch(savedTrailsUrl, {
                        credentials: "include",
                    });
                    if (savedTrailsResponse.ok) {
                        const savedTrailsData =
                            await savedTrailsResponse.json();
                        setSavedTrails(savedTrailsData.results);
                    } else {
                        console.error("Failed to fetch saved trails");
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [currentPage, postSuccess, user]);

    useEffect(() => {
        const fetchTags = async () => {
            const apiUrl = `${baseUrl}/content/tags/`;
            const response = await fetch(apiUrl);
            if (response.ok) {
                const tags = await response.json();
                setTagsList(tags);
            } else {
                console.error("Failed to fetch tags");
            }
        };

        fetchTags();
    }, []);

    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        const hours = date.getHours() % 12 || 12;
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
            .format(date)
            .replace(/(\d+):(\d+)/, `${hours}:$2`);
    }

    const deletePost = async (postId) => {
        const apiUrl = `${baseUrl}/content/posts/${postId}/`;
        const fetchConfig = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken.csrfToken,
            },
            credentials: "include",
        };

        const response = await fetch(apiUrl, fetchConfig);
        if (response.ok) {
            setPostSuccess(!postSuccess);
        }
    };

    const handleFilterChange = (selectedTagIds) => {
        setSelectedTags(selectedTagIds);
    };

    useEffect(() => {
        const applyFilter = () => {
            if (selectedTags.length > 0) {
                const newFilteredPosts = posts.filter((post) =>
                    post.tags.some((tag) =>
                        selectedTags.includes(tag.toString())
                    )
                );
                setFilteredPosts(newFilteredPosts);
            } else {
                setFilteredPosts(posts);
            }
        };

        applyFilter();
    }, [selectedTags, posts]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    function renderPagination() {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li
                    key={i}
                    className={`page-item ${i === currentPage ? "active" : ""}`}
                >
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                </li>
            );
        }
        return (
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                    </li>
                    {pages}
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        );
    }
    const handleSaveTrail = async (trailId) => {
        try {
            const response = await fetch(
                `${baseUrl}/trails/saved_trails/${trailId}/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken.csrfToken,
                    },
                    credentials: "include",
                }
            );
            if (response.ok) {
                console.log("Trail saved successfully");
                await fetchSavedTrails();
                setTrailSuccess(!trailSuccess);
            } else {
                console.error("Failed to save trail");
            }
        } catch (error) {
            console.error("Error saving trail:", error);
        }
    };

    const fetchSavedTrails = async () => {
        try {
            const response = await fetch(`${baseUrl}/trails/saved_trails/`, {
                credentials: "include",
            });
            if (!response.ok) {
                console.error(
                    `Fetch error: ${response.status} ${response.statusText}`
                );
                throw new Error(
                    `Network response was not ok: ${response.status}`
                );
            }
            const data = await response.json();
            setSavedTrails(data.results);
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    };

    return (
        <div className="page-container">
            <div className="content">
                <div className="container mt-3 mt-md-5">
                    <div className="row d-flex align-items-stretch">
                        <div className="col-md-7 d-flex flex-fill">
                            <div className="card w-100 mb-4">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">
                                        New Post
                                    </h5>
                                    <div className="form-group">
                                        <div
                                            id="fakeInput"
                                            className="form-control"
                                            data-bs-toggle="modal"
                                            data-bs-target="#newpostmodal"
                                            role="button"
                                            tabIndex="0"
                                        >
                                            What's on your mind?
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="modal fade"
                                id="newpostmodal"
                                data-bs-backdrop="static"
                                data-bs-keyboard="false"
                                tabIndex="-1"
                                aria-labelledby="newpostmodalLabel"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5
                                                className="modal-title fs-5"
                                                id="staticBackdropLabel"
                                            >
                                                New Post
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            {user ? (
                                                <NewPostForm
                                                    setPostSuccess={
                                                        setPostSuccess
                                                    }
                                                    postSuccess={postSuccess}
                                                    setTagsList={setTagsList}
                                                    tagsList={tagsList}
                                                />
                                            ) : (
                                                <AlertModal message="Please signup or login to post a new post" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex col-md-5">
                            <FilterPosts
                                onFilterChange={handleFilterChange}
                                tagsList={tagsList}
                            />
                        </div>
                    </div>
                    <div className="row">
                        {filteredPosts
                            .slice()
                            .reverse()
                            .map((post) => (
                                <div className="col-12" key={post.id}>
                                    <div className="card mb-4 p-1 pb-0">
                                        <div className="card-body">
                                            <div className="row">
                                                <div
                                                    className={`d-flex flex-column align-items-between justify-content-between ${
                                                        post.trail
                                                            ? "col-lg-8"
                                                            : "col-12"
                                                    }`}
                                                >
                                                    <div>
                                                        <h6 className="card-subtitle text-muted small mb-1">
                                                            {formatDate(
                                                                post.created_at
                                                            )}
                                                        </h6>
                                                        <span className="text-muted">
                                                            by{" "}
                                                        </span>
                                                        <Link
                                                            to={`/profiles/${post.author_id}`}
                                                        >
                                                            {
                                                                post.author_username
                                                            }
                                                        </Link>
                                                        <p className="card-text my-3">
                                                            {post.content}
                                                        </p>
                                                    </div>
                                                    <div className="d-flex flex-column">
                                                        <div className="mb-2">
                                                            {tagsList &&
                                                                post &&
                                                                post.tags &&
                                                                tagsList.length >
                                                                    0 &&
                                                                post.tags.map(
                                                                    (tagId) => {
                                                                        const tagObj =
                                                                            tagsList.find(
                                                                                (
                                                                                    tag
                                                                                ) =>
                                                                                    tag.id ===
                                                                                    tagId
                                                                            );
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    tagId
                                                                                }
                                                                                className="badge mb-2 me-2"
                                                                            >
                                                                                {tagObj
                                                                                    ? tagObj.name
                                                                                    : "Unknown Tag"}
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                        </div>
                                                        <div>
                                                            <PostLikeButton
                                                                postId={post.id}
                                                            />
                                                            <Link
                                                                to={`/posts/${post.id}`}
                                                                className="card-link"
                                                            >
                                                                Comments
                                                            </Link>
                                                            {/* <Link to={`#`} className="card-link">Edit</Link> */}
                                                            {user &&
                                                            user.id ===
                                                                post.author ? (
                                                                <button
                                                                    className="custom-btn-link ms-3"
                                                                    onClick={() =>
                                                                        deletePost(
                                                                            post.id
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        id="fakeInput"
                                                                        className="ms-3 custom-btn-link"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#nodeletemodal"
                                                                        tabIndex="0"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                    <div
                                                                        className="modal fade"
                                                                        id="nodeletemodal"
                                                                        data-bs-backdrop="static"
                                                                        data-bs-keyboard="false"
                                                                        tabIndex="-1"
                                                                        aria-labelledby="nodeletemodalLabel"
                                                                        aria-hidden="true"
                                                                    >
                                                                        <div className="modal-dialog">
                                                                            <div className="modal-content">
                                                                                <div className="modal-header">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn-close"
                                                                                        data-bs-dismiss="modal"
                                                                                        aria-label="Close"
                                                                                    ></button>
                                                                                </div>
                                                                                <div className="modal-body">
                                                                                    <AlertModal message="To delete a post, make sure you're logged-in and it's a post you posted" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ShowTrail post={post} user={user} savedTrails={savedTrails} handleSaveTrail={handleSaveTrail}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <div className="pagination-container">{renderPagination()}</div>
        </div>
    );
}

export default ListPosts;
