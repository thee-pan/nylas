import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import { TbAdjustmentsAlt } from "react-icons/tb";

export const SidebarData = [
  {
    title: "Events",
    path: "/events",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: "Read Email",
    path: "/read",
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: "Compose",
    path: "/send",
    icon: <FaIcons.FaPhone />,
  },

  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <TbAdjustmentsAlt />,
  },
];
