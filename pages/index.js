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
				<h1 className={styles.title}>
					Welcome to your{" "}
					<a
						target="_blank"
						href="https://hashgraph.remotesoftwaredevelopment.com/"
					>
						Serverless Hashgraph Client!
					</a>
				</h1>

				<div className={styles.grid}>
					<a
						href="https://nextjs.org/docs"
						target="_blank"
						className={styles.card}
					>
						<h3>Documentation &rarr;</h3>
						<p>
							Find in-depth documentation on how you can utilise this client for
							your project
						</p>
					</a>

					<a href="/api/status" target="_blank" className={styles.card}>
						<h3>Status Check &rarr;</h3>
						<p>
							Check the status of your client, has it been set up correctly?
							Psst, you can hide this screen.
						</p>
					</a>

					<a
						href="https://github.com/mattsmithies/hedera-serverless-consensus"
						target="_blank"
						className={styles.card}
					>
						<h3>The Projec &rarr;</h3>
						<p>Discover and deploy boilerplate example Next.js projects.</p>
					</a>

					<a
						href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
						target="_blank"
						className={styles.card}
					>
						<h3>Deploy More! &rarr;</h3>
						<p>
							Instantly deploy a new servlerless hashgraph client site to a
							public URL with Vercel.
						</p>
					</a>

					<a
						href="https://nextjs.org/docs"
						target="_blank"
						className={styles.card}
					>
						<h3>The Laravel Client &rarr;</h3>
						<p>Coming soon.</p>
					</a>

					<a
						href="https://nextjs.org/docs"
						target="_blank"
						className={styles.card}
					>
						<h3>About Hedera &rarr;</h3>
						<p>Find out more about Hedera Hashgraph</p>
					</a>
				</div>

				<h3 className={styles.subtitle}>
					Created by{" "}
					<a target="_blank" href="https://remotesoftwaredevelopment.com/">
						Matthew Smithies
					</a>
					<br />
					Find out more about my work & projects
				</h3>

				<div className={styles.grid}>
					<a
						href="https://nextjs.org/docs"
						target="_blank"
						className={styles.card}
					>
						<h3>Coursematch</h3>
						<p>
							Find in-depth documentation on how you can utilise this client for
							your project
						</p>
					</a>

					<a
						href="https://nextjs.org/docs"
						target="_blank"
						className={styles.card}
					>
						<h3>DOVU</h3>
						<p>
							Find in-depth documentation on how you can utilise this client for
							your project
						</p>
					</a>

					<a href="/api/status" target="_blank" className={styles.card}>
						<h3>Safe Stream</h3>
						<p>
							Check the status of your client, has it been set up correctly?
							Psst, you can hide this screen.
						</p>
					</a>

					<a
						href="https://github.com/mattsmithies/hedera-serverless-consensus"
						target="_blank"
						className={styles.card}
					>
						<h3>Envboard</h3>
						<p>Discover and deploy boilerplate example Next.js projects.</p>
					</a>
				</div>
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
