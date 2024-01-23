import dynamic from 'next/dynamic';
import Head from 'next/head';

const Chat = dynamic(() => import('../components/chat'), {
  ssr: false,
})

const Page = () => {
  return (
    <div>
      <Head>
        <title>Realtime Chat App with Ably, NextJS and Vercel</title>
        <link rel="icon" href="https://static.ably.dev/motif-red.svg?nextjs-vercel" type="image/svg+xml" />
      </Head>

      <Chat/>

      <footer>
        Powered by zghost10.
      </footer>
    </div>
  )
}
export default Page