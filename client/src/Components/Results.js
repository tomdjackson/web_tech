import React from 'react'
import Result from './Result.js'

const Results = (props) => {
  const options = props.results.map(r => (
    <li>
      <Result result={r}/>
    </li>
  ))
  return <ul>{options}</ul>
}

export default Results;
