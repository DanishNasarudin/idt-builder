## PC Part Picker for Ideal Tech PC

This is my first Next JS Project, Full Stack Development, building a webpage for my company that allows customers to choose a selection of PC parts with the latest pricing offered by the company.

The company already have the part picker page previously, however, it was made several years ago with PHP. Since I have no experience in PHP, it is harder to modify anything for the webpage. Hence, I decided to build an entirely new improved version of the webpage.

[View Website](https://build.idealtech.com.my/)

## Tech Implemented

|  | Tech | Purpose |
| -- | -- | -- |
| <img alt="" src= "https://static-00.iconduck.com/assets.00/nextjs-icon-512x512-y563b8iq.png" height="13"> | Next JS 13 | React Framework |
| <img alt="" src= "https://cdn-icons-png.flaticon.com/512/5968/5968381.png" height="13"> | Typescript | JS Syntax |
| <img alt="" src= "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/512px-Tailwind_CSS_Logo.svg.png?20230715030042" height="10"> | Tailwind CSS | CSS Framework |
| <img alt="" src= "https://i0.wp.com/community.nodemailer.com/wp-content/uploads/2015/10/n2-2.png?w=422&ssl=1" height="13"> | Nodemailer | Form to Email Handling |
| <img alt="" src= "https://bestofjs.org/logos/jspdf.dark.svg" height="13"> | jsPDF | PDF Generation |
| <img alt="" src= "https://cpanel.net/wp-content/themes/cPbase/assets/img/logos/cp_orange.svg" height="10"> | cPanel | Deployment |
| <img alt="" src= "https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.png" height="13"> | Cloudflare | CDN |

## Main Webpage Functionality

Users can do the following:

(Main Page)

1. Select various PC parts to accumulate to 1 PC build.
2. Add on additional duplicates of a part if they need to.
3. View the Final Price after discounts.
4. Search the entire selections through 1 search bar.
5. Create a quotation of the selections, and be able to share the link for others to review.

(Quotation Page)
1. View the Installment Prices from the final quotation.
2. Print the quotation by downloading the PDF version.
3. Copy the link of the quotation or copy the quotation in a text form.
4. Email the company with the quotation through the submission form.

## Database Overview

As of the time I wrote this README, the new webpage is still using JSON as the 'database' management. During the development of the webpage, I was rushing to finish up the main functionality, and I opted for JSON database to not spend any extra cost (During this time I didn't know MySQL existed within the company's cPanel server). 

Now that I am familiar with the use of MySQL, it will be the next upgrade for this webpage.

## Next JS Overview

This project is the first time I used Next JS right after my first Vite React Project. The experience was overall good. If the problem is solely due to Next JS, there will be a lot of documentation or solutions from the community. However, if the problem is related between Next JS and a third party, or a package, then the lack of solutions can be seen quite often.

For example, integration between Next JS and cPanel(110.0), was quite confusing at first. Since the Node version is v16.20.2 and upgrade was not an option, I had to opt in for Next JS 13.3.0 for it to launch without a problem. The build of the app was required to be done locally first, then uploaded manually to cPanel due to the lack of server resources to build itself. The use of htaccess was required to redirect a few requests to the server related to the Next JS filing as well (E.g. _next to .next).

Other than that it was a great experience using the new App Router. Being able to configure API and perform server actions from the same file is such a time saver.

## Tailwind CSS Overview

Tailwind is such a game-changer. My first 2 projects were using pure CSS. After using Tailwind, I never want to go back. The simplified classifications for certain styling were easy to use and manipulate. Since it's in the same file as the component, the implementation with useState made it possible to manipulate the styling.

## Webpage Before and After

Old version:
![old_version](https://github.com/DanishNasarudin/idt-builder/assets/86049685/d72718cb-aea3-4de3-8ad3-41d22792c516)

New version (mobile optimized):
![new_version](https://github.com/DanishNasarudin/idt-builder/assets/86049685/60d55abe-f116-4bd4-9b05-21eb8ddac6ab)
