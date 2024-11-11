import { compile } from 'handlebars'

const htmlTemplate = `<!DOCTYPE html>
<html lang="">

<head>
	<title></title>
	<meta content="summary_large_image" name="twitter:card" />
	<meta content="website" property="og:type" />
	<meta content="" property="og:description" />
	<meta content="https://l4mpue1em6.preview-beefreedesign.com/0hLY" property="og:url" />
	<meta content="https://pro-bee-beepro-thumbnail.getbee.io/messages/1296694/1282901/2289488/11923406_large.jpg" property="og:image" />
	<meta content="" property="og:title" />
	<meta content="" name="description" />
	<meta charset="utf-8" />
	<meta content="width=device-width" name="viewport" />
	<style>
		.bee-row,
		.bee-row-content {
			position: relative
		}

		.bee-row-1 {
			background-repeat: no-repeat
		}

		.bee-row-3,
		.bee-row-3 .bee-row-content {
			background-size: auto
		}

		.bee-row-2 .bee-row-content,
		.bee-row-3 .bee-row-content,
		.bee-row-4 .bee-row-content,
		body {
			color: #000000
		}

		body {
			background-color: transparent;
			font-family: Arial, Helvetica Neue, Helvetica, sans-serif
		}

		.bee-row-1 .bee-col-2 .bee-block-2 a,
		.bee-row-2 .bee-col-1 .bee-block-2 a,
		.bee-row-2 .bee-col-1 .bee-block-4 a,
		.bee-row-4 .bee-col-2 .bee-block-2 a,
		a {
			color: #01caa6
		}

		* {
			box-sizing: border-box
		}

		body,
		h1,
		p {
			margin: 0
		}

		.bee-row-content {
			max-width: 1280px;
			margin: 0 auto;
			display: flex
		}

		.bee-row-content.reverse,
		.bee-row-content.reverse .bee-col {
			-moz-transform: scale(1, -1);
			-webkit-transform: scale(1, -1);
			-o-transform: scale(1, -1);
			-ms-transform: scale(1, -1);
			transform: scale(1, -1)
		}

		.bee-row-content .bee-col-w2 {
			flex-basis: 16.6666666667%
		}

		.bee-row-content .bee-col-w6 {
			flex-basis: 50%
		}

		.bee-row-content .bee-col-w10 {
			flex-basis: 83.3333333333%
		}

		.bee-row-content .bee-col-w12 {
			flex-basis: 100%
		}

		.bee-button .content {
			text-align: center
		}

		.bee-button a,
		.bee-icon .bee-icon-label-right a {
			text-decoration: none
		}

		.bee-image {
			overflow: auto
		}

		.bee-image .bee-center {
			margin: 0 auto
		}

		.bee-row-1 .bee-col-1 .bee-block-1,
		.bee-row-4 .bee-col-1 .bee-block-1 {
			width: 100%
		}

		.bee-icon {
			display: inline-block;
			vertical-align: middle
		}

		.bee-icon .bee-content {
			display: flex;
			align-items: center
		}

		.bee-image img {
			display: block;
			width: 100%
		}

		.bee-paragraph {
			overflow-wrap: anywhere
		}

		@media (max-width:768px) {
			.bee-mobile_hide {
				display: none
			}

			.bee-row-content:not(.no_stack) {
				display: block
			}
		}

		.bee-row-1 .bee-row-content,
		.bee-row-5 .bee-row-content {
			background-color: #ffffff;
			background-repeat: no-repeat;
			color: #000000
		}

		.bee-row-2,
		.bee-row-2 .bee-row-content {
			background-color: #f8fbf7;
			background-repeat: no-repeat
		}

		.bee-row-1 .bee-col-1,
		.bee-row-4 .bee-col-1 {
			padding-bottom: 5px;
			padding-left: 10px;
			padding-top: 5px
		}

		.bee-row-1 .bee-col-2,
		.bee-row-4 .bee-col-2 {
			padding-bottom: 5px;
			padding-right: 20px;
			padding-top: 5px
		}

		.bee-row-1 .bee-col-2 .bee-block-2,
		.bee-row-2 .bee-col-1 .bee-block-2 {
			padding: 20px 10px 15px
		}

		.bee-row-2 .bee-col-1 {
			padding: 10px
		}

		.bee-row-2 .bee-col-1 .bee-block-3 {
			padding: 10px;
			text-align: center;
			width: 100%
		}

		.bee-row-2 .bee-col-1 .bee-block-4 {
			padding-bottom: 15px;
			padding-left: 10px;
			padding-right: 10px
		}

		.bee-row-2 .bee-col-1 .bee-block-5 {
			padding: 10px;
			text-align: center
		}

		.bee-row-2 .bee-col-2,
		.bee-row-5 .bee-col-1 {
			padding-bottom: 5px;
			padding-top: 5px
		}

		.bee-row-2 .bee-col-2 .bee-block-1 {
			padding: 32px;
			width: 100%
		}

		.bee-row-3 {
			background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7166/HR-divider-image_bottom.png');
			background-position: top center;
			background-repeat: repeat
		}

		.bee-row-3 .bee-row-content,
		.bee-row-4,
		.bee-row-4 .bee-row-content,
		.bee-row-5 {
			background-repeat: no-repeat
		}

		.bee-row-4 {
			background-color: #a2dba4
		}

		.bee-row-4 .bee-col-2 .bee-block-2 {
			padding: 20px 15px 15px
		}

		.bee-row-5 {
			background-color: #ffffff
		}

		.bee-row-5 .bee-col-1 .bee-block-1 {
			color: #1e0e4b;
			font-family: Inter, sans-serif;
			font-size: 15px;
			padding-bottom: 5px;
			padding-top: 5px;
			text-align: center
		}

		.bee-row-1 .bee-col-2 .bee-block-2 {
			color: #201f42;
			direction: ltr;
			font-size: 14px;
			font-weight: 400;
			letter-spacing: 0;
			line-height: 120%;
			text-align: right
		}

		.bee-row-1 .bee-col-2 .bee-block-2 p:not(:last-child),
		.bee-row-2 .bee-col-1 .bee-block-2 p:not(:last-child),
		.bee-row-2 .bee-col-1 .bee-block-4 p:not(:last-child),
		.bee-row-4 .bee-col-2 .bee-block-2 p:not(:last-child) {
			margin-bottom: 16px
		}

		.bee-row-2 .bee-col-1 .bee-block-3 h1 {
			color: #01caa6;
			direction: ltr;
			font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
			font-size: 50px;
			font-weight: 700;
			letter-spacing: normal;
			line-height: 120%;
			text-align: left
		}

		.bee-row-2 .bee-col-1 .bee-block-2 {
			color: #201f42;
			direction: ltr;
			font-size: 20px;
			font-weight: 700;
			letter-spacing: 0;
			line-height: 120%;
			text-align: left
		}

		.bee-row-2 .bee-col-1 .bee-block-4 {
			color: #201f42;
			direction: ltr;
			font-size: 22px;
			font-weight: 400;
			letter-spacing: 0;
			line-height: 150%;
			text-align: left
		}

		.bee-row-5 .bee-col-1 .bee-block-1 .bee-icon-image {
			padding: 5px 6px 5px 5px
		}

		.bee-row-5 .bee-col-1 .bee-block-1 .bee-icon:not(.bee-icon-first) .bee-content {
			margin-left: 0
		}

		.bee-row-5 .bee-col-1 .bee-block-1 .bee-icon::not(.bee-icon-last) .bee-content {
			margin-right: 0
		}

		.bee-row-4 .bee-col-2 .bee-block-2 {
			color: #ffffff;
			direction: ltr;
			font-size: 14px;
			font-weight: 400;
			letter-spacing: 0;
			line-height: 120%;
			text-align: right
		}
	</style>
</head>

<body>
	<div class="bee-page-container">
		<div class="bee-row bee-row-1">
			<div class="bee-row-content">
				<div class="bee-col bee-col-1 bee-col-w2">
					<div class="bee-block bee-block-1 bee-image"><img alt="" class="bee-fixedwidth" src="https://proyek-ta.vercel.app/logo-black.jpg" style="max-width:81px;" /></div>
				</div>
				<div class="bee-col bee-col-2 bee-col-w10">
					<div class="bee-block bee-block-1 bee-spacer bee-mobile_hide">
						<div class="spacer" style="height:10px;"></div>
					</div>
					<div class="bee-block bee-block-2 bee-paragraph bee-mobile_hide">
						<p>Panthreon Notification</p>
					</div>
				</div>
			</div>
		</div>
		<div class="bee-row bee-row-2">
			<div class="bee-row-content reverse">
				<div class="bee-col bee-col-1 bee-col-w6">
					<div class="bee-block bee-block-1 bee-spacer bee-mobile_hide">
						<div class="spacer" style="height:60px;"></div>
					</div>
					<div class="bee-block bee-block-2 bee-paragraph">
						<p>Greetings, Panthreon members!</p>
					</div>
					<div class="bee-block bee-block-3 bee-heading">
						<h1><span class="tinyMce-placeholder">{{title}}<br /></span> </h1>
					</div>
					<div class="bee-block bee-block-4 bee-paragraph">
						<p>{{subtitle}}</p>
					</div>
					<div class="bee-block bee-block-5 bee-button"><a class="bee-button-content" href="{{buttonLink}}" style="font-size: 16px; background-color: #01caa6; border-bottom: 0px solid transparent; border-left: 0px solid transparent; border-radius: 6px; border-right: 0px solid transparent; border-top: 0px solid transparent; color: #ffffff; direction: ltr; font-family: inherit; font-weight: 400; letter-spacing: 0px; max-width: 100%; padding-bottom: 5px; padding-left: 20px; padding-right: 20px; padding-top: 5px; width: 80%; display: inline-block;" target="_blank"><span style="word-break: break-word; font-size: 16px; line-height: 200%; letter-spacing: normal;">{{buttonText}}</span></a></div>
				</div>
				<div class="bee-col bee-col-2 bee-col-w6">
					<div class="bee-block bee-block-1 bee-image"><img alt="" class="bee-center bee-autowidth" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7166/Onboarding-illo-hero.png" style="max-width:466px;" /></div>
					<div class="bee-block bee-block-2 bee-spacer bee-mobile_hide">
						<div class="spacer" style="height:60px;"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="bee-row bee-row-3">
			<div class="bee-row-content">
				<div class="bee-col bee-col-1 bee-col-w12">
					<div class="bee-block bee-block-1 bee-spacer">
						<div class="spacer" style="height:150px;"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="bee-row bee-row-4">
			<div class="bee-row-content">
				<div class="bee-col bee-col-1 bee-col-w2">
					<div class="bee-block bee-block-1 bee-image"><img alt="" class="bee-fixedwidth" src="https://proyek-ta.vercel.app/logo-white-removebg-preview.png" style="max-width:81px;" /></div>
				</div>
				<div class="bee-col bee-col-2 bee-col-w10">
					<div class="bee-block bee-block-1 bee-spacer">
						<div class="spacer" style="height:10px;"></div>
					</div>
					<div class="bee-block bee-block-2 bee-paragraph">
						<p>Copyright © 2024 Panthreon, All rights reserved.</p>
					</div>
				</div>
			</div>
		</div>
		<div class="bee-row bee-row-5">
			<div class="bee-row-content">
				<div class="bee-col bee-col-1 bee-col-w12">
					<div class="bee-block bee-block-1 bee-icons">
						<div class="bee-icon bee-icon-last">
							<div class="bee-content">
								<div class="bee-icon-image"><a href="http://designedwithbeefree.com/" target="_blank" title="Designed with Beefree"><img alt="Beefree Logo" height="32px" src="https://d1oco4z2z1fhwp.cloudfront.net/assets/Beefree-logo.png" width="auto" /></a></div>
								<div class="bee-icon-label bee-icon-label-right"><a href="http://designedwithbeefree.com/" target="_blank" title="Designed with Beefree">Designed with Beefree</a></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>

</html>`

export function getHTML({ title, subtitle, buttonLink, buttonText }) {
  const template = compile(htmlTemplate)
  return template({ title, subtitle, buttonLink, buttonText })
}
