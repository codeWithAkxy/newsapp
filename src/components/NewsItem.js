import React from 'react'

const NewsItem =(props) =>{
   let {title, description, imageUrl, newsUrl, author,  publishedAt, source} = props;
    return (
      <div>
        <div className="card">
        <span className="badge rounded-pill bg-info" style={{display:'flex', justifyContent:'flex-end',position:'absolute',right:'0'}}>{source}</span>
          <img src={imageUrl} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <p className="card-text"><small className="text-muted">By {author?author:"unknown"} on {new Date(publishedAt).toGMTString()}</small></p>
            <a rel="noreferrer" href={newsUrl} target='_blank' className="btn btn-sm btn-dark">Read More</a>
          </div>
        </div>
      </div>
    )
}

export default NewsItem
