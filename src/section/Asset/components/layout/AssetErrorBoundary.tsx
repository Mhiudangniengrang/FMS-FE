import  { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
} from "@mui/material"
import { Refresh as RefreshIcon } from "@mui/icons-material"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class AssetErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Asset Error Boundary caught an error:", error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Đã xảy ra lỗi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Có lỗi xảy ra khi tải dữ liệu tài sản. Vui lòng thử lại.
              </Typography>
            </Alert>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <Box sx={{ mt: 3, textAlign: "left" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Chi tiết lỗi (chỉ hiển thị trong development):
                </Typography>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    backgroundColor: "#f5f5f5",
                    p: 2,
                    borderRadius: 1,
                    overflow: "auto",
                    fontSize: "0.75rem",
                  }}
                >
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleRetry}
              sx={{ mt: 3 }}
            >
              Thử lại
            </Button>
          </Paper>
        </Container>
      )
    }

    return this.props.children
  }
}

export default AssetErrorBoundary 