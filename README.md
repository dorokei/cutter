# Get site information from url.

This is the function of Cloud Functions for Firebase.
Enable to get site information (site name, title, description, favicon image url, etc.) of given url.

## Sample

If you want to get site information of _dev.to_, you can call below url.
https://[YOUR_PROJECT_ID].cloudfunctions.net/getSiteInfo?url=https://dev.to/

And, will get below.

```
{
  title:
    'DEV Community  👩‍💻👨‍💻 - Where software engineers connect, build their resumes, and grow.',
  description: 'Where programmers share ideas and help each other grow.',
  og_site_name: 'The DEV Community',
  og_title: 'The DEV Community',
  og_description: 'Where programmers share ideas and help each other grow.',
  og_image:
    'https://thepracticaldev.s3.amazonaws.com/i/g355ol6qsrg0j2mhngz9.png',
  favicon_image:
    'https://practicaldev-herokuapp-com.freetls.fastly.net/assets/favicon-bca01e42dfbe772972ebe01e7150cdb8b75555c612b20b7e3059a10e0ca6f759.ico'
}
```

## Functions Code

See file [functions/index.js](functions/index.js) for the code.

If you want to customize the response of this api, you could change ``getSiteInfo`` function in [functions/index.js](functions/index.js).

This uses the [axios](https://github.com/axios/axios) and [cheerio](https://github.com/cheeriojs/cheerio).

The dependencies are listed in [functions/package.json](functions/package.json).

## Deploy

Install the Firebase CLI using npm by running:
```
npm install -g firebase-tools
```

Sign into Firebase using your Google account by running:
```
firebase login
```

List all of your Firebase projects by running:
```
firebase list
```

Change your firebase app if needed by running:
```
firebase use <project_id>
```

To emulate HTTP functions only, use the following command:
```
firebase serve --only functions
```

Deploy
```
firebase deploy --only functions
```

if you were asked a question below:
```
Would you like to proceed with deletion? Selecting no will continue the rest of the deployments.
```
Basicaly you should answer N.
