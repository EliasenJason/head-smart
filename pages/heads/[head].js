import styled from "styled-components";
import { useRouter } from 'next/router';

export default function HeadType(props) {
  console.log(props)
  return (
    <h3>this is the head page</h3>
  )
}

export async function getStaticProps({ params }) {
  return {
    props: {
      data: {
        test: 'can i make this show up?'
      }
    }
  }
}

export async function getStaticPaths() { //will need to be asynchronous when pulling from database
  let paths = [{
    params: {
      head: 'testing'
    }
  }]
  // let paths = ['testing']
  return {
    paths,
    fallback: false
  }
}