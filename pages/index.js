import Link from 'next/link';
import Card from '../components/cards';

export default function Home() {
  return (
    <>
      
      
      <Link href="/heads">
        <button>
          <Card
            image="/pictures/parts.jpg"
            alt="picture of consumables"
            title="Head Smart"
            description="use this area to find the right part for the right fluid end"
          />
        </button>
      </Link>
      <Link href="/maintenance">
        <button>
          <Card
            image="/"
            alt="someone send me a picture of someone doing head maintenance"
            title="Maintenance Tracker"
            description="Keep track of required maintenance with this app"
          />
        </button>
      </Link>
    </>
  )
}