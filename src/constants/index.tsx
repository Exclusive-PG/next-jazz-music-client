import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HouseIcon from "@mui/icons-material/House";
import { type SvgIconOwnProps } from "@mui/material";

export type PropsNavList = {
  id: number;
  title: string;
  link: string;
  icon: React.ReactElement<SvgIconOwnProps>;
};

export const navList: Array<PropsNavList> = [
  { id: 1, title: "Home", link: "/", icon: <HouseIcon /> },
  {
    id: 2,
    title: "Upload music",
    link: "/upload",
    icon: <CloudUploadIcon />,
  },
  { id: 3, title: "Dashboard", link: "/dashboard", icon: <DashboardIcon /> },
];
