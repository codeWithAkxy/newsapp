import React, { useState, useEffect } from 'react'
import NewsItem from './NewsItem'
import Loaders from './Loaders';
import propTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';
import newsImage from '../newsImage.jpg'


const News = (props) => {

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [hasMore, setHasMore] = useState(true);

  // document.title = `NewsMonkey - ${this.capitalize(props.category)}`


  const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  const fetchNews = async () => {
    props.setProgress(10);
    setLoading(true)
    let data = await fetch(`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&pageSize=${props.pageSize}&page=${page}`);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100);
  }

  const fetchMoreData = async () => {
    let data = await fetch(`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&pageSize=${props.pageSize}&page=${page + 1}`);
    setPage(page + 1)
    let parsedData = await data.json();
    if (parsedData.articles.length === 0) {
      setHasMore(false);
    } else {
      setArticles(articles.concat(parsedData.articles))
      setTotalResults(parsedData.totalResults)
    }
    
  }

  useEffect(() => {
    fetchNews();
  }, [])


  // const handleOnNext = async () => {
  //   this.setState({ page: page + 1 }, () => {
  //     this.fetchNews()
  //   })
  // }


  // const handlePrevClick = async () => {
  //   this.setState({ page: page - 1 }, () => {
  //     this.fetchNews()
  //   })
  // }

  return (
    <>
      <h1 className='text-center' style={{ margin: '30px 0px', marginTop: '70px' }}>NewsMonkey - {capitalize(props.category)} Top Headlines</h1>
      {loading && <Loaders />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={articles.length < totalResults ? <Loaders /> : null}
      >
        <div className="container">
          <div className="row my-2">
            {articles.map((element, index) => {
              return <div className="col-md-4 my-2" key={index}>
                <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage ? element.urlToImage : newsImage} newsUrl={element.url}
                  publishedAt={element.publishedAt} author={element.author} source={element.source.name} />
              </div>
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  )
}

// News.defaultProps = {
//   country: 'in',
//   pageSize: 8,
//   category: "general"
// }

News.propTypes = {
  country: propTypes.string,
  pageSize: propTypes.number,
  category: propTypes.string
}

export default News
