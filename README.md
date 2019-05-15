# Defend-Web-Track

## Background

While people are enjoying web service, they are not aware that their information has been tracked by the website and utilize them to identify you and they can push the specific advertisement to you. The most widely way they use is recording your cookie and IP address. However, there is growing awareness among web users that HTTP cookies are a serious threat to privacy, and many people now block, limit or periodically delete them. Awareness of super-cookies is lower, but political and PR pressures may eventually force firms like Adobe to make their super-cookies comply with the browser's normal HTTP cookie privacy settings.
In the meantime, the website try to use a new technic called browser fingerprinting to identify users. Browser fingerprinting is an increasingly common yet rarely discussed technique of identifying an individual user by the unique patterns of information visible whenever a computer visits a website. The information collected is quite comprehensive and often includes the browser type and version, operating system and version, screen resolution, supported fonts, plugins, time zone, language and font preferences, and even hardware configurations. These identifiers may seem generic and not at all personally identifying, yet typically only one in several million people have exactly the same specifications as you[1].
The browser fingerprint technique took another big step in 2012 with the release of the Mowery and Shacham paper, which focused primarily on the effectiveness of the canvas fingerprint. The technique for creating the canvas fingerprint is to give the browser a somewhat complex image to render, capture the actual pixel values produced, which is then hashed down to make the actual fingerprint. This study determined that “fingerprints are inherent when the browser is— for performance and consistency— tied closely to operating system functionality and system hardware.” They also summarized the possibility of distinguishing between systems with seemingly identical fingerprints by rendering scenes that stress the underlying hardware.[1]
The end result is the ability to track users even if they are deleting all their cookies and hiding their IP addresses with tools. While fingerprints are not identifying in the same way as an IP address, they do enable user recognition whenever revisiting a website. Even when deleting cookies, the browser fingerprint allows organizations to re-identify and re-cookie your system, essentially rejecting your efforts to remain private.
Our key contributions are:
(1) Develop some methods to defend Browser Fingerprinting.
(2) Develop some methods to defend Canvas Fingerprinting.
(2) Evaluate our work.
 
## Web Fingerprinting
When we visit a website, we need to send the http request to the server and the http header includes some information of our Brower such as User Agent, Accept, Content encoding etc. Because of the difference of computers, browsers and people who use it, nearly each people send different header. In figure 1, we can see that less than 0.1% people use the same agent like us and only 15.19% people who have the same plugins like us. Website can distinguish us by combining such difference. However, it is not enough for them to identify us because even if two people who have the same header, they stil l can not identify which one is the real one. So Http header is not enough to implement such track.
What’s more, they can use JavaScript language to read our computer information like timezone and screen resolution (figure 2). These extend the information they can use.

<img src="https://github.com/zzzyyyxxxmmm/Defend-Web-Track/img/1.png">
<img src="https://github.com/zzzyyyxxxmmm/Defend-Web-Track/img/2.png">


## Canvas Fingerprinting
Canvas fingerprinting works by exploiting the HTML5 canvas element. As described by Acar et. al. in [2]:
When a user visits a page, the fingerprinting script first draws text with the font and size of its choice and adds background colors (1). Next, the script calls Canvas API’s ToDataURL method to get the canvas pixel data in dataURL format (2), which is basically a Base64 encoded representation of the binary pixel data. Finally, the script takes the hash of the text-encoded pixel data (3), which serves as the fingerprint ...
Variations in which GPU is installed or the graphics driver cause the variations in the fingerprint. The fingerprint can be stored and shared with advertising partners to identify users when they visit affiliated websites. A profile can be created from the user's browsing activity allowing advertisers to target advertising to the user's inferred demographics and preferences.[3][4].
We can test our canvas fingerprinting in browserleaks.com like figure3

<img src="https://github.com/zzzyyyxxxmmm/Defend-Web-Track/img/3.png">

## Defense
We propose two methods to defend track we mentioned above. First one is to modify the http header and the second one is to override JavaScript prototype function.

### modify http header
From section 2, we can see that most of the information comes from the http header. If we can modify the http header before it sends, we can forge a bogus http header so that website can not correctly identify us. There have several ways to implement that like jQuery. Here we choose to implement chrome.webRequest.onBeforeSendHeaders.addListener to monitor the http request each time it sends. We enumerate all the http header and choose the one we want to modify and save it.
However, there still have several problems if we just simply modifying the header.
1. Randomizing the http header is an identifier in itself. Although the web fingerprint will not be same each time it sends, the http header will look very strange if you just send some random string and you will be sorted into a very small group of tech-savvy users who are also blocking fingerprints, and from there, your ordinary fingerprints will sometimes be enough to identify you completely.
To visualize how this works, imagine you are standing in a crowd. Not caring about web fingerprinting is like you’re just standing there smiling. Having a canvas fingerprint blocker is like you’re standing there with a mask. No one is sure who you are exactly, but you’re the only one wearing a mask, so you can be identified like that. Even if a few other people are wearing masks, you all are simply grouped together as “the people wearing masks”.[5]
So, we randomly choose the most widely used http headers from [6] instead of generating a random string. Because each time we choose a header which is widely used by people, so the header looks normal. You change to a normal face rather than wearing a mask.
2. Actually, even if we solve the above problem, we still can be tracked. A normal visitor will not change his fingerprint in a session. So, if you change your fingerprint during a session, that behavior is unusual, and it’s enough to categorize you into an irregular group. In our example, submitting random web fingerprint is like you continuously change your face which is really strange. So, we record the last website we visit and check weather the top level of the url changes or not. If it doesn’t change, that means we are still accessing a same website so we should not change the http header for the next time.

<img src="https://github.com/zzzyyyxxxmmm/Defend-Web-Track/img/4.png">

### Override JavaScript Function
The second is to modify the prototype of JavaScript. The server can utilize some JavaScript functions to collect our information in addition to http header like timezone, plugins. We hope to change it as same as http header. They way we did this is to override the key function. We inject our script before the website loads so that the website can only use our own function. As for the canvas, we just randomize the result.
We can test the timezone function in chrome console:

<img src="https://github.com/zzzyyyxxxmmm/Defend-Web-Track/img/5.png">

The Date().prototype function provide the protype function that can help us to override it. Some functions doesn’t provide prototype, so we need to override the keywords that rewrite the whole definition of the function using defineProperty.

<img src="https://github.com/zzzyyyxxxmmm/Defend-Web-Track/img/6.png">

Because we don’t find the most widely used canvas configuration, we just simply add noise when generate pictures using canvas.

## Evaluation
We develop a chrome extension to implement our defense. Most of the language we use is JavaScript, jQuery and HTML. With the document of google extension development, we successfully develop our own chrome extension based on an extension which simply implement changing http header [7]. We add function override and solve the problem in 3.1.

<img src="https://github.com/zzzyyyxxxmmm/Defend-Web-Track/img/7.png">

We have two options: change header or change JavaScript, and url line indicates the last url we visited.
We test our extension on amiunique.com to show the difference between the situation before and after we change the HTTP header. Figure8 shows the normal fingerprinting information we have. Even we using incognito window to open this web, we still get the same information which means we have been tracked. Figure9 shows the result after we open our extension. We can see the difference between User-Agent, Accept, screen resolution and timezone. We can see that canvas changed by observing Similarity ratio. Besides, we can also test our canvas from [8] which generate a signature of our canvas like figure 7.

<img src="https://github.com/zzzyyyxxxmmm/Defend-Web-Track/img/8.png">

<img src="https://github.com/zzzyyyxxxmmm/Defend-Web-Track/img/9.png">

<img src="https://github.com/zzzyyyxxxmmm/Defend-Web-Track/img/10.png">

<img src="https://github.com/zzzyyyxxxmmm/Defend-Web-Track/img/11.png">

## Challenge

### Write a chrome extension
we just google the method of developing a chrome extension and write it step by step.
 (https://developer.chrome.com/extensions/getstarted)

### Inject script before the page loads.
Actually, we can use content scripts to write our injection code. But this code only effect on the extension popup page and doesn’t work on the real page, we need to inject our code again on content scripts so that the script can effect on the real page.

### Communicating between popup and content script.
I plan to add some alert on the popup to show which information the web try to get from us and the most hard part is how to send message from content script to popup. I tried to send message from override function in content script but it doesn’t work. And I just use alert() to show the message.

<img src="https://github.com/zzzyyyxxxmmm/Defend-Web-Track/img/12.png">

## Related work
Some http header extension is useful in github[7]. We can test our browser uniqueness in [9][10]. The browser fingerprint technique took another big step in 2012 with the release of the Mowery and Shacham paper[11], which focused primarily on the effectiveness of the canvas fingerprint.

## Conclusion
We presented and tested different method kind of browser fingerprinting methods. It appeared, in general, to be very effective. Browser fingerprinting is a powerful technique, and fingerprints must be considered alongside HTTP headers and JavaScript when we discuss web privacy and user trackability. Although fingerprints turn out not to be particularly stable, browsers reveal so much version and configuration information that they remain overwhelmingly trackable. There are implications both for privacy policy and technical design.
In our project, we try to modify the HTTP header and JavaScript. The original object is to
make us more difficult to be tracked. We use the similarity as our guideline. We try to change
the similarity ratio of different attributes and lead trackers to a wrong direction of detecting us. We are sure that this strategy is useful and practical as us imagine.

## References

[1] Lance Cottrell, chief scientist, Ntrepid, Browser fingerprints, and why they are so hard to erase, https://www.networkworld.com/article/2884026/security0/browser-fingerprints-and-why-they-are-so-hard-to-erase.html
[2]Acar, Gunes; Eubank, Christian; Englehardt, Steven; Juarez, Marc; Narayanan, Arvind; Diaz, Claudia (July 24, 2014). "The Web never forgets: Persistent tracking mechanisms in the wild". Retrieved July 24, 2014.
[3] Angwin, Julia (July 21, 2014). "Meet the Online Tracking Device That is Virtually Impossible to Block". ProPublica. Retrieved July 21, 2014.
[4] Nikiforakis, Nick; Acar, Günes (2014-07-25). "Browser Fingerprinting and the Online-Tracking Arms Race". ieee.org. IEEE. Retrieved October 31, 2014.
[5] How Canvas Fingerprint Blockers Make You Easily Trackable https://multiloginapp.com/how-canvas-fingerprint-blockers-make-you-easily-trackable/
[6] Most Common User Agents https://techblog.willshouse.com/2012/01/03/most-common-user-agents/
[7] chenyoufu modify-http-headers https://github.com/chenyoufu/modify-http-headers
[8] http://yuya-takeyama.github.io/canvas_fingerprint_checker/8]
[9] panopticlick https://panopticlick.eff.org/
[10] Am I Unique https://amiunique.org/
[11] Mowery, Keaton and Hovav Shacham. “Pixel Perfect: Fingerprinting Canvas in HTML5.” (2012).


