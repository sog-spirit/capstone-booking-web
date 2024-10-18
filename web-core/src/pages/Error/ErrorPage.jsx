export default function ErrorPage() {
    return (
        <div className="error-page">
            <div className="error-page__container">
                <div className="error-page__container__title">
                    <h3>Page could not be loaded</h3>
                </div>
                <div className="error-page__container__content">
                    <p>The requested page could not be loaded</p>
                    <p>Check your internet connection and try again</p>
                    <p>Certain browser extensions, such as ad blockers, may block page unexpectedly</p>
                    <p>System may be temporarily unavailable. Please check back later</p>
                    <div className="error-page__container__content__home-button">
                        Home
                    </div>
                </div>
            </div>
        </div>
    );
}