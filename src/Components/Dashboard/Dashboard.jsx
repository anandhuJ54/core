import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import "./Dashboard.scss";
import { CircularProgress, Typography } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { baseUrlIs } from "../../Store/EditReducer";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const jwtToken = Cookies.get("jwt_token");
  useEffect(() => {}, []);
  const location = useLocation();

  useEffect(() => {
    console.log(`Cookies `, jwtToken);
    if (jwtToken === "undefined" || jwtToken === undefined) {
      navigate("/");
    } else {
      axios
        .get(`http://3.147.10.206:9000/global_master_app/api/products/`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        .then((response) => {
          setLoading(false);
          const updatedProjects = response.data.map(formatDatesInProject);
          const projects = response.data;
          if (projects.length > 0) {
            dispatch(baseUrlIs(projects[0].project_instance_url));
          } else {
            dispatch(baseUrlIs(""));
          }
          setProjects(updatedProjects);
        })
        .catch((error) => {
          console.error("An error occurred:", error);
          setProjects([]);
        });
    }
  }, []);

  function formatDatesInProject(project) {
    function formatDate(dateString) {
      if (dateString) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          const options = { day: "2-digit", month: "short", year: "numeric" };
          return date.toLocaleDateString("en-US", options);
        } else {
          console.error(`Invalid date: ${dateString}`);
        }
      }
      return dateString;
    }

    return {
      ...project,
      created_on: formatDate(project.created_on),
      modified_on: formatDate(project.modified_on),
    };
  }

  const handleEditClick = async (project) => {
    navigate("/hierarchy", { state: { projectName: project.name } });
  };

  return (
    <>
      <Header />
      <div className="box-main">
        {loading && <CircularProgress className="progress" />}
        {/* {projects.map((project, index) => (
          <Card className="card-main" key={index}>
            <CardContent className="card-content">
              <div className="project-name">
                <img
                  className="card-image"
                  src={project.logo}
                  alt="card-logo"
                />
                <Typography className="card-name">{project.name}</Typography>
              </div>
              <Typography className="card-sub-title">
                Created on:{" "}
                <span className="sub-fills">{project.created_on}</span>
              </Typography>
              <Typography className="card-sub-title">
                Modified on:{" "}
                <span className="sub-fills">{project.modified_on}</span>
              </Typography>
              <Typography className="card-sub-title">
                Description:<br></br>
                <span className="sub-fills">{project.description}</span>
              </Typography>
            </CardContent>
            <CardActions className="card-actions">
              <Button
                className="delete-btn"
                onClick={() => handleEditClick(project)}
              >
                <RemoveRedEyeOutlinedIcon className="icon" /> View Page
              </Button>
            </CardActions>
          </Card>
        ))} */}
        <div>
          <a
            href="http://localhost:8222/project"
            target="_blank"
            onClick={() => {
              Cookies.set("jwt_token", jwtToken, {
                expires: 1 / 6,
              });
              console.log("href clicked");
            }}
          >
            Data hub
          </a>
          {/* <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("http://localhost:8222/project", {
                state: {
                  token: "123",
                },
              });
            }}
          >
            Data hub
          </span> */}
        </div>
      </div>
      <Footer />
    </>
  );
}
