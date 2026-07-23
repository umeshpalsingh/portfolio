import PlayClient from './PlayClient';

export default function Play() {
  return (
    <section className="play" id="play">
        <div className="wrap">
            <div className="eyebrow reveal">just for fun</div>
            <h2 className="reveal">Break time</h2>
            <p className="section-sub reveal">Two tiny games. Zero productivity. Wildly on brand for a developer.</p>

            <PlayClient />
        </div>
    </section>
  );
}
