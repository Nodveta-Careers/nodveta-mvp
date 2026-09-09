export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/private-sale",
      permanent: false,
    },
  };
}

export default function Home() {
  return null;
}
