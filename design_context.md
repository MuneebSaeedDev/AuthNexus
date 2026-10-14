# Design Context — Authentication Application

## 1. Project Overview

This project is a personal learning application focused on user authentication.

The frontend includes three authentication flows:

1. Login
2. Signup
3. Logout

The purpose is to build a clean, modern, responsive authentication experience connected to a real backend API.

The application must remain focused on authentication. Do not introduce dashboards, organization management, admin panels, subscription pages, or other unrelated screens.

## 2. Design Principles

The interface must follow these principles:

- Clean, modern, professional visual design.
- Clear visual hierarchy and readable typography.
- Consistent spacing, colors, borders, and component sizes.
- Minimal visual clutter.
- Clear form labels and understandable validation messages.
- Accessible keyboard navigation and focus states.
- Consistent design between Login and Signup.
- Responsive behavior across mobile, tablet, laptop, and desktop.
- Proper loading, success, and error states.

Prefer simple, maintainable components over unnecessary visual complexity.

## 3. Design Reference Priority

Before creating or modifying a screen, follow this priority order:

1. Existing project instructions and established design system.
2. Existing Figma designs, if accessible and relevant.
3. Existing shared frontend components and styling conventions.
4. The design defaults defined in this document.

If a relevant Figma MCP server is available, inspect the existing design before implementing the screen.

If no Figma reference exists, use the existing project design system. If no design system exists, establish a consistent authentication-page style using the rules below.

Never claim that a design was taken from Figma if it was not inspected.

Do not introduce a new UI library, CSS framework, icon library, or component library without checking the existing dependencies first.

## 4. Visual Direction

Use a restrained, polished SaaS-style authentication design.

### Layout

- Place the authentication form in a clearly defined main content area.
- Center the form vertically and horizontally where appropriate.
- Use a readable form width of approximately 380–440px on desktop.
- Maintain adequate padding around the form.
- Avoid excessive empty space on small screens.
- Use a full-width form layout on mobile with suitable side margins.
- If the existing project has an established split-screen authentication layout, preserve and reuse it.

### Colors

Use the existing project color tokens when available.

If no color system exists, use a restrained neutral palette:

- Primary text: dark charcoal or near-black.
- Secondary text: muted gray.
- Page background: white or a subtle neutral.
- Input background: white or a subtle neutral.
- Borders: light gray.
- Primary action: one consistent accent color.
- Errors: accessible red.
- Success: accessible green.

Do not introduce multiple competing accent colors, heavy gradients, or decorative effects that reduce readability.

### Typography

- Use the existing project font when available.
- Otherwise, use a clean system sans-serif font.
- Give page headings a clear visual hierarchy.
- Keep descriptions and helper text readable.
- Use consistent font weights and line heights.
- Avoid excessively large headings on mobile.

### Components

Use consistent styling for:

- Text inputs.
- Password inputs.
- Buttons.
- Labels.
- Helper text.
- Error messages.
- Links.
- Loading indicators.
- Form containers.
- Notifications, if already supported.

Use existing shared components instead of creating duplicate implementations.

## 5. Login Page

The Login page must include:

- Application name or existing logo.
- Heading: "Welcome back".
- Short supporting description.
- Email field.
- Password field.
- Show/hide password control.
- Login button.
- Link to the Signup page.
- Field validation.
- Loading state during API submission.
- Clear feedback for invalid credentials or server errors.

The Login button must be disabled or protected against duplicate submissions while a request is in progress.

Display validation errors near the relevant fields when possible.

Never display raw backend stack traces or internal server details to users.

Do not add a "Forgot password" flow unless it already exists and is implemented or explicitly requested.

## 6. Signup Page

The Signup page must include:

- Application name or existing logo.
- Heading: "Create your account".
- Short supporting description.
- Name field.
- Email field.
- Password field.
- Confirm password field, if appropriate for the existing form design.
- Show/hide password control.
- Signup button.
- Link to the Login page.
- Field validation.
- Loading state.
- Success and failure feedback.

Password confirmation must be checked before submitting the form when that field is present.

Do not imply that an account was successfully created until the backend confirms success.

Do not invent email verification, social login, or account approval workflows.

## 7. Logout Experience

Logout is an authenticated action, not necessarily a separate public page.

Provide a clearly identifiable Logout button or menu action wherever authenticated-state controls already exist.

On logout:

1. Call the backend logout endpoint if required by the selected authentication strategy.
2. Clear the appropriate client-side authentication state.
3. Update the application authentication state.
4. Navigate to Login.
5. Handle API failures without incorrectly claiming that server-side session revocation succeeded.

If the application does not have an authenticated layout, do not create a new dashboard merely to display Logout.

## 8. Responsive Design

Test the authentication UI at these representative viewport widths:

- Mobile: 320–430px.
- Tablet: 768px.
- Laptop: 1024–1440px.
- Desktop: 1440px and above.

Requirements:

- No horizontal overflow.
- No clipped inputs or buttons.
- Appropriate form margins.
- Readable text at different viewport sizes.
- Touch-friendly controls.
- Correct keyboard focus behavior.
- Usable layouts at browser zoom levels up to 200%, subject to the application's layout constraints.

Prefer fluid widths and responsive CSS over fixed desktop-only dimensions.

## 9. Accessibility

- Every input must have an accessible label.
- Use semantic form elements.
- Buttons must have meaningful accessible names.
- Password visibility controls must communicate their purpose.
- Validation errors must be identifiable and associated with their fields where practical.
- Do not rely on color alone to communicate an error.
- Provide visible keyboard focus indicators.
- Respect reduced-motion preferences if animations are implemented.

## 10. Motion and Interaction

Keep animations subtle and purposeful.

Use short transitions for hover, focus, and loading interactions where appropriate.

Avoid unnecessary page transitions, elaborate background animations, excessive blur, and decorative effects that interfere with performance or accessibility.

All visible controls must perform their intended actions.

## 11. Implementation Rules

Before implementing any design:

1. Read the repository instructions.
2. Inspect the current screen and reusable components.
3. Inspect existing design tokens and styling.
4. Inspect relevant Figma designs if available.
5. Identify the minimum changes needed.
6. Implement the design using existing project conventions.
7. Verify responsive behavior and form interactions.

Do not redesign unrelated pages.

Do not replace the established design system without a clear reason.

Do not use hardcoded fake authentication responses to simulate a working application.

## 12. Design Acceptance Criteria

The implementation is acceptable when:

- Login and Signup have a consistent visual language.
- Both forms connect to the real backend API.
- Loading, validation, and failure states are visible.
- Logout performs the expected authentication cleanup.
- Layouts work on mobile, tablet, laptop, and desktop.
- Existing reusable components and styles are respected.
- No unrelated screens or enterprise features are introduced.
- The interface is keyboard accessible and avoids horizontal overflow.