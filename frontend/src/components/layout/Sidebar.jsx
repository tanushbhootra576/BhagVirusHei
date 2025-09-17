import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { IconDashboard, IconNotes, IconBell, IconPlus, IconHourglass, IconCheckCircle, IconChart, IconAlert, IconUser, IconSettings } from '../common/Icons';
//import '../../styles/sidebar.css';
const Sidebar = ({ isOpen }) => {
    const { isGovernment, isCitizen } = useAuth();

    const sidebarClass = isOpen ? "sidebar open" : "sidebar";

    return (
        <aside className={sidebarClass}>
            {/* <div className="sidebar-header">
                <h3>Dashboard</h3>
            </div> */}

            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink
                            to="/dashboard"
                            end
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            <span className="icon"><IconDashboard /></span>
                            <span>Overview</span>
                        </NavLink>
                    </li>

                    {isCitizen && (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard/my-issues"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <span className="icon"><IconNotes /></span>
                                    <span>My Issues</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/notifications"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <span className="icon"><IconBell /></span>
                                    <span>Notifications</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/report-issue"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <span className="icon"><IconPlus /></span>
                                    <span>Report New Issue</span>
                                </NavLink>
                            </li>
                        </>
                    )}

                    {isGovernment && (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard/pending-issues"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <span className="icon"><IconHourglass /></span>
                                    <span>Pending Issues</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/resolved-issues"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <span className="icon"><IconCheckCircle /></span>
                                    <span>Resolved Issues</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/analytics"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <span className="icon"><IconChart /></span>
                                    <span>Analytics</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/alerts"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <span className="icon"><IconAlert /></span>
                                    <span>Manage Alerts</span>
                                </NavLink>
                            </li>
                        </>
                    )}

                    <li className="divider"></li>

                    <li>
                        <NavLink
                            to="/profile"
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            <span className="icon"><IconUser /></span>
                            <span>Profile</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/settings"
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            <span className="icon"><IconSettings /></span>
                            <span>Settings</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
