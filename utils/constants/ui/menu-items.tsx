import { Calendar, ChartBar, Clock, Cloud, Factory, Home, LogOut, Printer, Server, Settings, Shield, User, Users } from 'lucide-react';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export const menuItems: MenuItem[] = [
  getItem('Dashboard', 'dashboard', <Home strokeWidth={1.5} className='w-4 h-4' />, [
    getItem('Daily Attendance Statistics', 'users/tom', <ChartBar strokeWidth={1.5} className='w-4 h-4' />),
  ]),
  getItem('Human Resources', 'hr', <Users strokeWidth={1.5} className='w-4 h-4' />, [
    getItem('Employees', 'hr/employees', <User strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Shift Scheduling', 'hr/shift-scheduling', <Calendar strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Take leave', 'hr/take-leave', <Calendar strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Work Attendance', 'hr/work-attendance', <Calendar strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Overtime', 'hr/overtime', <Clock strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Base Salary', 'hr/base-salary', <Clock strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Social Insurance', 'hr/social-insurance', <Clock strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Contract', 'hr/contract', <Clock strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Workday', 'hr/workday', <Calendar strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Statistical Workday', 'hr/statistical-workday', <Calendar strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Utils', 'hr/utils', <Calendar strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Print Card', 'hr/print-card', <Printer strokeWidth={1.5} className='w-4 h-4' />),
  ]),
  getItem('Factory Inspection', 'factoryInspection', <Factory strokeWidth={1.5} className='w-4 h-4' />, [
    getItem('Workday', 'hr/workday/v1', <Calendar strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Statistical Workday', 'hr/statistical-workday/v1', <Calendar strokeWidth={1.5} className='w-4 h-4' />),
  ]),
  getItem('IT', 'it', <Server strokeWidth={1.5} className='w-4 h-4' />, [
    getItem('Roles and Permissions', 'it/roles-and-permissions', <Shield strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Tracking Log', 'it/tracking-log', <Cloud strokeWidth={1.5} className='w-4 h-4' />),
  ]),
  getItem('Others', 'others', <Calendar strokeWidth={1.5} className='w-4 h-4' />, [
    getItem('Meeting', 'others/meeting', <Calendar strokeWidth={1.5} className='w-4 h-4' />),
  ]),
  getItem('Settings', 'settings', <Settings strokeWidth={1.5} className='w-4 h-4' />, [
    getItem('User Information', 'settings/user-information', <ChartBar strokeWidth={1.5} className='w-4 h-4' />),
    getItem('Account Role', 'settings/account-role', <ChartBar strokeWidth={1.5} className='w-4 h-4' />),
  ]),
  getItem('Logout', 'logout', <LogOut strokeWidth={1.5} className='w-4 h-4' />)
]; 