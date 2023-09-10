import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "70vh" }}>
      <CircularProgress sx={{ color: "#1E3264", width: "5rem" }} />
    </div>
  );
}