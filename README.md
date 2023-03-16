An application designed to automate the crewing up process on film sets by storing user's “Go-To” personnel for specific roles, and allowing them to send batch job offers. When an offer is declined, the app automatically sends the offer to the next person on the “Go-To” list. This can save freelance gig workers a lot of time by eliminating the need to contact people individually in order to fill out their crew list. When users make a request to "Crew Up", the app uses SendGrid to send customized emails to the top choice candidate for each role. From the email, the candidates can click a link which displays the details of the job offer, and choose to decline or accept the offer. This action sends off another request which will update the status on the project owner's app, and if the candidate declined the offer, then SendGrid will send another email to the next perosn on the list.  

Created with Next 13, Tailwind CSS, Prisma, Railway, SendGrid, Auth0, and React Dnd.

See the deployed version [here](https://crew-up.vercel.app/). 
