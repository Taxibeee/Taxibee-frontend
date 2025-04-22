import { Skeleton } from "@mui/joy";

export const LoadingSkeleton = () => {
    return (
      <Skeleton
        animation="pulse"
        variant="rectangular"
        height={170}
        width={300}
        sx={{ borderRadius: 1 }}
      />
    );
  };