import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ListPages from "./pages/Pages/ListPages";
import CreatePage from "./pages/Pages/CreatePage";
import ViewPage from "./pages/Pages/ViewPage";
import EditPage from "./pages/Pages/EditPage";
import ListAnnouncements from "./pages/Announcements/ListAnnouncements";
import CreateAnnouncement from "./pages/Announcements/CreateAnnouncement";
import ViewAnnouncement from "./pages/Announcements/ViewAnnouncement";
import EditAnnouncement from "./pages/Announcements/EditAnnouncement";
import ListModules from "./pages/Modules/ListModules";
import CreateModule from "./pages/Modules/CreateModule";
import EditModule from "./pages/Modules/EditModule";
import Unauthorized from "./pages/Unauthorized";
import { useApi } from "./apiV3";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Layout/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { UIProvider } from "./context/UIContext";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { useUI } from "./context/UIContext";

const AppContent = () => {
  const { darkMode, navbarOpen } = useUI();
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Navbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: navbarOpen ? "240px" : "60px",
            transition: "margin 0.3s",
          }}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route path="/" element={<PrivateRoute element={HomePage} />} />
            <Route
              path="/profile"
              element={<PrivateRoute element={ProfilePage} />}
            />
            <Route
              path="/pages"
              element={<PrivateRoute element={ListPages} />}
            />
            <Route
              path="/pages/:id"
              element={<PrivateRoute element={ViewPage} />}
            />
            <Route
              path="/pages/create"
              element={
                <PrivateRoute element={CreatePage} roles={["Teacher"]} />
              }
            />
            <Route
              path="/pages/edit/:id"
              element={<PrivateRoute element={EditPage} roles={["Teacher"]} />}
            />
            <Route
              path="/announcements"
              element={<PrivateRoute element={ListAnnouncements} />}
            />
            <Route
              path="/announcements/:id"
              element={<PrivateRoute element={ViewAnnouncement} />}
            />
            <Route
              path="/announcements/create"
              element={
                <PrivateRoute
                  element={CreateAnnouncement}
                  roles={["Teacher"]}
                />
              }
            />
            <Route
              path="/announcements/edit/:id"
              element={
                <PrivateRoute element={EditAnnouncement} roles={["Teacher"]} />
              }
            />
            <Route
              path="/modules"
              element={<PrivateRoute element={ListModules} />}
            />
            <Route
              path="/modules/create"
              element={
                <PrivateRoute element={CreateModule} roles={["Teacher"]} />
              }
            />
            <Route
              path="/modules/edit/:id"
              element={
                <PrivateRoute element={EditModule} roles={["Teacher"]} />
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const App = () => {
  const pageTypesApi = useApi("page_types");
  const pagesApi = useApi("pages");
  const modulesApi = useApi("modules");
  const announcementsApi = useApi("announcements");

  useEffect(() => {
    const initializeData = async () => {
      const existingPageTypes = await pageTypesApi.getAll();
      if (!existingPageTypes || existingPageTypes.length === 0) {
        await pageTypesApi.bulkCreate([
          { type: "HomePage" },
          { type: "GenericPage" },
          { type: "Assignment" },
          { type: "In-Class Exercise" },
        ]);
      }

      const pages = await pagesApi.getAll();
      const homePageExists = pages.some(
        (page) => page.page_type === "HomePage"
      );
      if (!homePageExists) {
        await pagesApi.create({
          title: 'Welcome to "Canvas"!',
          content: `
## Welcome to "Canvas"!

This project emulates basic features of Canvas.

### For Students:
- **Home Page**: This page welcomes you and provides information about the course, or in this case, the Canvas emulation.
- **Modules**: Access course modules containing pages and assignments.
- **Pages**: Read course content and materials.
- **Announcements**: Stay updated with the latest news and updates from teachers.

### For Teachers:
- **Create Pages**: Teachers can develop course content and materials for students.
- **Create Modules**: Teachers can organize pages and assignments into modules.
- **Manage Announcements**: Teachers can communicate important information to students.
- **Edit Home Page**: Teachers can customize the home page content for the course.

Enjoy your experience using this Canvas emulation!
          `,
          page_type: "HomePage",
        });
      }

      const existingModules = await modulesApi.getAll();
      if (!existingModules || existingModules.length === 0) {
        const examplePage = await pagesApi.create({
          title: "Example Page",
          content: `
### Example Content

This is an example page included in the Example Module.
          `,
          page_type: "GenericPage",
        });

        await modulesApi.create({
          title: "Example Module",
          description:
            "This is an example module containing an example page, switch to teacher to add pages and get the full experience.",
          published: true,
          order: 1,
        });

        await pagesApi.update(examplePage.id, {
          ...examplePage,
          module_id: 1,
          order_in_module: 1,
        });
      }

      const existingAnnouncements = await announcementsApi.getAll();
      if (!existingAnnouncements || existingAnnouncements.length === 0) {
        await announcementsApi.create({
          title: "Welcome Announcement",
          content: `
**Welcome to the course!**

This is an example announcement. Stay tuned for updates and important information.
          `,
          date: new Date().toISOString(),
        });
      }
    };
    initializeData();
  }, []);

  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <AppContent />
        </Router>
      </UIProvider>
    </AuthProvider>
  );
};

export default App;
