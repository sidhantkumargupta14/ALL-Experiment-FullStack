# Unified Post Management System

## Features
- JWT login and session management
- Generated JWT token is visible on the Dashboard after login
- Copy JWT token button
- Admin, Editor and Viewer RBAC
- Post creation, editing and deletion according to role
- Draft management
- Redux Toolkit and Reselect
- Multi-platform post validation

## Post permissions
- Admin-created post: Admin = edit/delete; Editor = edit only; Viewer = view only.
- Editor-created post: Admin = edit/delete; Editor = edit only; Viewer = view only.

## Demo accounts
Admin: admin / admin123
Editor: editor / editor123
Viewer: viewer / viewer123

## Run backend
cd server
npm install
npm run dev

## Run frontend in another terminal
cd client
npm install
npm run dev
