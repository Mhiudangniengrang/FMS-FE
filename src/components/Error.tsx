import { Button, Typography, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import ErrorImage from "../assets/error.png";
import React from "react";

function ErrorPage(): React.ReactElement {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "80vh",
        }}
      >
        {/* Error Image */}
        <Box sx={{ mb: 3 }}>
          <img
            src={ErrorImage}
            alt="404 Error"
            style={{
              maxWidth: "100%",
              height: "auto",
              maxHeight: "300px",
            }}
          />
        </Box>

        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Sorry, the page you visited does not exist.
        </Typography>
        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Back home
        </Button>
      </Box>
    </Container>
  );
}

export default ErrorPage;
