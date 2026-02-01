import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import React from 'react'

export default function CustomPagination({ count, page, rowsPerPage, onPageChange }) {
  const totalPages = Math.ceil(count / rowsPerPage)
  const startIndex = count === 0 ? 0 : page * rowsPerPage + 1;
  const endIndex = Math.min((page + 1) * rowsPerPage, count);
  const handlePageClick = (newPage) => {
    onPageChange(null, newPage);
  };
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7;
    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {pages.push(i)}
    } else {
      pages.push(0);

    let startPage = Math.max(1, page - 1);
      let endPage = Math.min(totalPages - 2, page + 1);
      if (page <= 2) {
        endPage = 3;
      }if (page >= totalPages - 3) {
        startPage = totalPages - 4;
      }if (startPage > 1) {
        pages.push("ellipsis-start");
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }if (endPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }
       pages.push(totalPages - 1);
    }
    return pages
  }
  const pageNumbers = getPageNumbers()
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        borderTop: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontSize: "0.875rem", color: "#6B7280" }}
      >
        Showing{" "}
        <strong>
          {startIndex}-{endIndex}
        </strong>{" "}
        of <strong>{count}</strong> records
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <IconButton
          onClick={() => handlePageClick(page - 1)}
          disabled={page === 0}
          size="small"
          sx={{
            width: 32,
            height: 32,
            border: "1px solid #E5E7EB",
            borderRadius: 1,
            color: "#6B7280",
            "&:hover": {
              backgroundColor: "#F9FAFB",
              borderColor: "#D1D5DB",
            },
            "&.Mui-disabled": {
              borderColor: "#F3F4F6",
              color: "#D1D5DB",
            },
          }}
        >
          <ChevronLeft fontSize="small" />
        </IconButton>
        {pageNumbers.map((pageNum, index) => {
          if (typeof pageNum === "string" && pageNum.startsWith("ellipsis")) {
            return (
              <Typography
                key={pageNum}
                sx={{
                  fontSize: "0.875rem",
                  color: "#6B7280",
                  px: 1,
                }}
              >
                ...
              </Typography>
            );
          }

          const isActive = pageNum === page;

          return (
            <Button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              variant={isActive ? "contained" : "outlined"}
              sx={{
                minWidth: 32,
                width: 32,
                height: 32,
                padding: 0,
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 400,
                border: "1px solid",
                borderColor: isActive ? "primary.main" : "#E5E7EB",
                backgroundColor: isActive ? "primary.main" : "#FFFFFF",
                color: isActive ? "#FFFFFF" : "#6B7280",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: isActive ? "primary.main" : "#F9FAFB",
                  borderColor: isActive ? "primary.main" : "#D1D5DB",
                },
              }}
            >
              {pageNum + 1}
            </Button>
          );
        })}
        <IconButton
          onClick={() => handlePageClick(page + 1)}
          disabled={page >= totalPages - 1}
          size="small"
          sx={{
            width: 32,
            height: 32,
            border: "1px solid #E5E7EB",
            borderRadius: 1,
            color: "#6B7280",
            "&:hover": {
              backgroundColor: "#F9FAFB",
              borderColor: "#D1D5DB",
            },
            "&.Mui-disabled": {
              borderColor: "#F3F4F6",
              color: "#D1D5DB",
            },
          }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
