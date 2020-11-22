import Head from "next/head"
import styles from "../styles/Home.module.css"

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>Serverless Hashgraph</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<img
					src="/decentralized-on-HH_black.jpg"
					alt="Vercel Logo"
					className={styles.supportIcon}
				/>

				<h1 className={styles.title}>
					Welcome to your{" "}
					<a target="_blank" href="https://trust.enterprises/">
						Serverless Hashgraph Beta Client! 🚀
					</a>
				</h1>

				<div className={styles.grid}>
					<a
						href="https://docs.trust.enterprises/"
						target="_blank"
						className={styles.card}
					>
						<h4>Documentation &rarr;</h4>
						<p>
							Find in-depth documentation on how you can record and audit trust
							in your your project.
						</p>
					</a>

					<a href="/api/status" target="_blank" className={styles.card}>
						<h4>Status Check &rarr;</h4>
						<p>
							Check the status of your client, has it been set up correctly?
							Psst, you can hide this screen.
						</p>
					</a>

					<a
						href="https://vercel.com/import/git?s=https://github.com/mattsmithies/hedera-serverless-consensus&env=HEDERA_NETWORK,HEDERA_ACCOUNT_ID,HEDERA_PRIVATE_KEY,API_SECRET_KEY&envDescription=Enter%20your%20account%20id%20and%20private%20key%20from%20the%20hedera%20portal.%20The%20API%20secret%20is%20your%20authentication%20key%20to%20communicate%20with%20your%20API,%20create%20a%20secure%20string%20of%20at%20least%2010%20characters.&envLink=https%3A%2F%2Fdocs.trust.enterprises%2Fdeployment%2Fenvironment-variables&redirect-url=https%3A%2F%2Fdocs.trust.enterprises%2Frest-api%2Foverview"
						target="_blank"
						className={styles.card}
					>
						<h4>Deploy More! &rarr;</h4>
						<p>
							Deploy a new secure serverless hashgraph REST API client site to a
							public URL with Vercel.
						</p>
					</a>

					<a
						href="https://github.com/trustenterprises/hedera-serverless-consensus"
						target="_blank"
						className={styles.card}
					>
						<h4>The Github Code &rarr;</h4>
						<p>
							Make a contribution, raise an issue or simply peek at our code
							with the curiosity of a thousand toads.
						</p>
					</a>

					<a target="_blank" className={styles.card}>
						<h4>The Laravel Client (coming soon)</h4>
						<p>
							Add trust events to your SaaS. Webhooks and storage for all audit
							logs are all automatically handled.
						</p>
					</a>

					<a
						href="https://www.hedera.com/"
						target="_blank"
						className={styles.card}
					>
						<h4>About Hedera &rarr;</h4>
						<p>
							Find out more about Hedera Hashgraph and what it can offer you.
						</p>
					</a>
				</div>

				<h2 className={styles.subtitle}>
					Created by{" "}
					<a target="_blank" href="https://remotesoftwaredevelopment.com/">
						Matthew Smithies
					</a>
					<br />
					Find out more about my work with{" "}
					<a target="_blank" href="https://coursematch.io/">
						Coursematch
					</a>{" "}
					and{" "}
					<a target="_blank" href="https://dovu.io/">
						DOVU
					</a>
					.
					<br />
					Alternatively, take a peek at my{" "}
					<a target="_blank" href="https://worldclassremote.com/">
						blog for remote startup teams
					</a>
					,{" "}
					<a target="_blank" href="https://safestream.info/">
						Safe Stream
					</a>{" "}
					or{" "}
					<a target="_blank" href="https://envboard.dev/">
						Envboard
					</a>
					.
				</h2>
			</main>

			<footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{" "}
					<img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
				</a>
			</footer>
		</div>
	)
}
