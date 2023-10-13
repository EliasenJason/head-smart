import Link from 'next/link';
import Card from '../components/cards';

export default function Home() {
  return (
    <>
      
      
        <Link href="/heads">
          <button>
            <Card
              image="/../public/pictures/parts.jpg"
              title="Head Smart"
              description="find the trican and vendor part numbers for the correct head"
            />
          </button>
        </Link>
      <button><Link href="/maintenance">Maintenance Tracker</Link></button>
    </>
  )
}