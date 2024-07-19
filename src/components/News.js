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
      page: 1,
      totalResults:0
    }
    document.title = `NewsMonkey - ${this.capitalize(this.props.category)}`
  }

  capitalize=(text) =>{
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  fetchNews = async () => {
    this.props.setProgress(10);
    this.setState({ loading: true });
    let data = await fetch(`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&pageSize=${this.props.pageSize}&page=${this.state.page}`);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false
    });
    this.props.setProgress(100);
  }

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 }, async () => {
      const data = await fetch(`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&pageSize=${this.props.pageSize}&page=${this.state.page}`);
      let parsedData = await data.json();
      this.setState({
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults,
      });
    });
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
      <>
        <h1 className='text-center' style={{ margin: '30px 0px' }}>NewsMonkey - {this.capitalize(this.props.category)} Top Headlines</h1>
        {this.state.loading && <Loaders />}
         <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length < this.state.totalResults}
          loader={this.state.articles.length < this.state.totalResults ? <Loaders /> : null}
        >
          <div className="container">
        <div className="row my-2">
          {this.state.articles.map((element, index) => {
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
}

export default News
