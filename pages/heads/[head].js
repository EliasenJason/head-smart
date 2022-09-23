import styled from "styled-components";
import { useRouter } from 'next/router';
import data from '../../public/data.json'

export default function Head({headFromUrl}) {
  
  const filteredData = data.heads.filter((head) => { //filter thru the data file and match up the correct head from static props
    return head.name === headFromUrl.head
  })[0]
  return (
    <h3>{filteredData.name.split('_').join(' ')}</h3>
  )
}

export async function getStaticProps({ params }) { //pass the headtype being displayed to the component as props
  return {
    props: {
      headFromUrl: params
    }
  }
}

export async function getStaticPaths() { //will need to be asynchronous when pulling from database

  const pathsFromData = data.heads.map((item) => { //create all the possible paths from the datafile
    return (
      {
        params: {
          head: item.name
        }
      }
    )
  })

  let paths = pathsFromData

  return {
    paths,
    fallback: false
  }
}