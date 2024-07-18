import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Loaders from './Loaders';
import propTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';
import newsImage from '../newsImage.jpg'


export class News extends Component {

  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: "general"
  }

  static propTypes = {
    country: propTypes.string,
    pageSize: propTypes.number,
    category: propTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1
    }
    document.title = `NewsMonkey - ${this.capitalize(this.props.category)}`
  }

  capitalize=(text) =>{
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  fetchNews = async () => {
    let data = await fetch(`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=d27aa66367804fb296c0b7ef1f1d8c82&pageSize=${this.props.pageSize}&page=${this.state.page}`)
    this.setState({ loading: true })
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false
    })
  }

  async componentDidMount() {
    this.fetchNews();
  }

  handleOnNext = async () => {
    this.setState({ page: this.state.page + 1 }, () => {
      this.fetchNews()
    })
  }

  handlePrevClick = async () => {
    this.setState({ page: this.state.page - 1 }, () => {
      this.fetchNews()
    })
  }

  render() {
    return (
      <div className='container my-3'>
        <h1 className='text-center' style={{ margin: '30px 0px' }}>NewsMonkey - {this.capitalize(this.props.category)} Top Headines</h1>
        {this.state.loading && <Loaders />}
        <div className="row my-2">
          {!this.state.loading && this.state.articles.map((element) => {
            return <div className="col-md-4 my-2" key={element.url}>
              <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage ? element.urlToImage : newsImage} newsUrl={element.url}
                publishedAt={element.publishedAt} author={element.author} source={element.source.name} />
            </div>
          })}
        </div>
        <div className="container my-4 d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-primary" onClick={this.handlePrevClick} >&larr; Previous</button>
          <button disabled={this.state.page >= Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-primary" onClick={this.handleOnNext} >Next &rarr;</button>
        </div>
      </div>
    )
  }
}

export default News
