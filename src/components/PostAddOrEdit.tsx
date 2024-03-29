import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useNavigate, useParams } from "react-router";
import { addPost, editPost, getPost } from "../storage/blogStorageActions";
import { PostInterface } from "../types";
import ErrorPage from "./ErrorPage";
import { Link } from "react-router-dom";

const PostAddOrEdit = () => {
  const navigate = useNavigate();
  const [isValidEdit, setIsValidEdit] = useState(true);
  const [postData, setPostData] = useState<PostInterface>({
    id: 0,
    title: "",
    content: "",
    imgUrl: "",
    createdAt: new Date(),
  });
  const { id } = useParams();
  useEffect(() => {
    if (id && !isNaN(parseInt(id))) {
      const currentPostData = getPost(parseInt(id));
      if (!currentPostData) {
        setIsValidEdit(false);
      } else {
        setPostData(currentPostData);
      }
    }
  }, [id]);
  const [errors, setErrors] = useState<Partial<PostInterface>>({});

  const isValidUrl = (url: string): boolean => {
    // Simple URL validation
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target;
    setPostData((prevData) => ({
      ...prevData,
      [name as string]: value as string,
    }));
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formErrors: Partial<PostInterface> = {};
    if (!postData.title.trim()) {
      formErrors.title = "Title is required";
    }
    if (!postData.content.trim()) {
      formErrors.content = "Content is required";
    }

    if (postData.imgUrl && !isValidUrl(postData.imgUrl.trim())) {
      formErrors.imgUrl = "Invalid URL format";
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setErrors({});
      if (!id) {
        addPost(postData);
      } else {
        editPost(postData);
      }
      navigate(`/post/${postData.id}`);
    }
  };

  return (
    <>
      {isValidEdit ? (
        <Container>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              value={postData.title}
              fullWidth
              margin="normal"
              error={!!errors.title}
              helperText={errors.title}
              onChange={handleChange}
            />
            <TextField
              label="Content"
              name="content"
              value={postData.content}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              error={!!errors.content}
              helperText={errors.content}
              onChange={handleChange}
            />
            <TextField
              label="Image URL"
              name="imgUrl"
              value={postData.imgUrl}
              fullWidth
              margin="normal"
              error={!!errors.imgUrl}
              helperText={errors.imgUrl}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="success"
              type="submit"
              sx={(theme) => ({
                mt: 2,
                py: 0.4,
                pl: 0.5,
                pr: 1,
                mr: 1,
              })}
            >
              Submit
            </Button>
            {postData.id !== 0 && (
              <Link to={`/post/${id}`}>
                <Button
                  sx={(theme) => ({
                    mt: 2,
                    py: 0.4,
                    pl: 0.5,
                    pr: 1,
                    mr: 1,
                  })}
                  variant="contained"
                  color="primary"
                  type="button"
                >
                  Back
                </Button>
              </Link>
            )}
            {postData.id === 0 && (
              <Link to="/">
                <Button
                  sx={(theme) => ({
                    mt: 2,
                    py: 0.4,
                    pl: 0.5,
                    pr: 1,
                    mr: 1,
                  })}
                  variant="contained"
                  color="primary"
                  type="button"
                >
                  Back
                </Button>
              </Link>
            )}
          </form>
        </Container>
      ) : (
        <ErrorPage />
      )}
    </>
  );
};

export default PostAddOrEdit;
