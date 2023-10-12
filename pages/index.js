import Head from 'next/head';
import styled, { createGlobalStyle } from 'styled-components';
import Title from '../components/title';
import data from '../public/data.json';
import Link from 'next/link';
import Heads from './heads'



export default function Home() {
  return (
    <>
      <button><Link href="/heads">Head Types</Link></button>
      <button><Link href="/maintenance">Maintenance Tracker</Link></button>
    </>
  )
}