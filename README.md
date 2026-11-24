# Mysterious Vibes in Transylvania

A responsive holiday deal page developed using Next.js and React, based on the supplied LowCostVibes JSON content and custom desktop and mobile Figma designs.

## Technologies Used

- Next.js
- React.js
- JavaScript
- CSS
- JSON
- Figma
- Netlify

## Features

- Responsive desktop and mobile layouts
- Automatic hero image carousel
- Sticky section navigation
- Light and dark mode
- Interactive day-by-day itinerary
- Hotel image gallery
- Expandable hotel amenities
- Expandable overview and hotel descriptions
- Optional excursions and payment information
- Expandable fine print
- FAQ accordion
- Testimonial carousel
- Enquiry form with client-side validation

## Getting Started

Prerequisites: Node.js 22 and npm.

Install dependencies:

`npm install`

Start the development server:

`npm run dev`

Open http://localhost:3000 in your browser.

## Production Build

`npm run build`

`npm start`

## Project Structure

- `app/` - Application layout, page entry point and global styles.
- `components/DealPage.js` - Page components and interactive functionality.
- `components/content.js` - HTML content extraction and image path utilities.
- `data/deal-page-data.json` - Original supplied JSON data.
- `public/icons/` - Interface icons.
- `public/pictures/` - Local image assets.
- `scripts/` - Data validation utilities.
- `netlify.toml` - Deployment configuration.

## Content and Design Decisions

- Holiday information is retrieved from the supplied JSON wherever applicable.
- The original JSON file remains unchanged.
- Images and icons are stored locally to reduce reliance on external resources.
- The duplicate £56 Belle Époque excursion is displayed only once.
- The apparent spelling error "Beitrag" in the Day 3 itinerary is interpreted as "Biertan" in the displayed content.
- The "Bucharest:" prefix is removed from excursion titles to improve readability.
- The complimentary Transylvania day trip is distinguished from the optional paid excursion to avoid confusion.
- Custom section taglines and content grouping improve readability and visual hierarchy.
- Light and dark themes use consistent typography and theme-specific colours.

## Deployment

The project is configured for deployment on Netlify using its Next.js integration.

Build command: `npm run build`

## Limitations

- The enquiry form demonstrates client-side validation without a backend submission service.
- Testimonials are illustrative content created for the assessment and are not verified customer reviews.
- Exact inclusions and entrance fees for optional excursions require confirmation.
- The interpretation of "Beitrag" as "Biertan" is an assumed spelling correction.

## Development Assistance

AI-assisted development tools were used during implementation and refinement.