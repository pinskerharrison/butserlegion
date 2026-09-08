# Editing the website

Your administrator will send a Pages CMS link and arrange access. Open that link, sign in and select the Legion website on **main**. Everything saved there is intended for publication. Do not put private information into a public field, photo or caption.

## Change the homepage

Choose **Homepage**. Edit the heading, introduction and additional copy in the normal text editor. Use heading level 2 for sections; the page already has its main heading. Choose or upload a main photograph and describe what it shows. The optional button wording links to Events. Save, then allow a few minutes for publishing and refresh the website.

## Add an event

1. Open **Events** and choose the option to add a new entry.
2. Enter its name and a short unique web address name, such as `butser-farm-july-2027`. This is a form field, not a file you need to edit. Keep it unchanged after publication.
3. Pick the date. Leave End date blank for a one-day event.
4. Enter UK local times using the 24-hour clock: `10:00`, `14:30` or `16:00`. End time is optional. For an event continuing after midnight, select the next day as its end date.
5. Add the venue name and full address, including postcode.
6. Write a short description and a fuller explanation. Mention booking requirements, private attendance, admission arrangements and anything visitors need to know. Do not invent a ticket price.
7. Optionally choose a photograph, add its description, and paste the full HTTPS venue or booking link.
8. Turn on Featured if wanted. It adds a small label; date order stays the same.
9. Save. Check the published page once it has rebuilt.

To change an event, select it in Events. To cancel, switch on **Event is cancelled** and explain in the description. The page and listing retain a cancellation notice; the homepage stops promoting it. Use Delete for entries created in error; deletion removes the event page and may break shared links. Past events archive themselves after their last day and the next scheduled rebuild.

## Photographs

Use JPG, PNG, WebP or AVIF. Upload a sensible-size image, ideally around 1600–2000 pixels wide and below 5 MB. The website prepares smaller versions automatically. Use photos the organisation has permission to publish, including consent where appropriate. Describe the subject in a sentence; do not repeat “image of”. Decorative captions are separate from the image description.

The **Gallery photographs** section lets you add, remove and reorder gallery entries. Lower display-order numbers appear first. The first photo is displayed wide. Do not delete a photo from the media library while any page or event still uses it.

## Other text and contact details

Use **About the Legion**, **Joining and membership**, **Booking the Legion**, **Contact page text** and **Visitor memories** for page copy. **Contact details** updates the shared address and public organisation email in the footer and contact panels.

## If an update does not appear

Wait a few minutes, then refresh. Check you saved on main. If it still does not appear, contact the website administrator with the entry name and what changed. An invalid date, missing image description or deleted image can stop publication. The existing live site remains available. An administrator can read the build message or restore the previous version; editors do not need to use Actions.

## Administrator: editor access

Use the hosted [Pages CMS](https://app.pagescms.org/), not a self-hosted installation. Connect the GitHub App only to the intended repository. Select the repository and invite collaborators by email using its collaborator management UI. This allows non-GitHub editors to change content and media without managing configuration. Do not put collaborator names or email addresses in `.pages.yml` or this public repository.

To remove access, remove the collaborator in Pages CMS. Also remove any separately granted GitHub repository/team access. If a GitHub account is used instead, grant only the access required to edit the repository. Limit repository administration and GitHub App management to maintainers. If branch protection requires pull requests, arrange an intentional publishing policy compatible with CMS saves rather than silently allowing every editor to bypass it.

The exact hosted interface can change. The current model is documented in [Pages CMS collaborators](https://pagescms.org/docs/configuration/collaborators/). Complete a real invite, homepage save, image upload, event creation and cancellation test before handing over. These authentication-dependent actions cannot be verified in an unconnected local repository.
