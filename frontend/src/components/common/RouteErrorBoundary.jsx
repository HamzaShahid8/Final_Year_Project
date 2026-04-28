import { Component } from 'react'

export class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected UI error occurred.',
    }
  }

  componentDidCatch() {
    // Intentionally silent for production-safe fallback.
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="ui-alert-danger grid min-h-[40vh] place-items-center rounded-xl p-6 text-center">
          <div>
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm">{this.state.errorMessage}</p>
            <button onClick={this.handleReset} className="ui-btn-secondary mt-4 rounded px-4 py-2">
              Try Again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
