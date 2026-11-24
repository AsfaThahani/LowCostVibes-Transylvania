'use client';
import { useEffect, useState } from 'react';
import { plain, items, paragraphs, picture } from './content';
const links = ['Overview', 'Highlights', 'Itinerary', 'Hotel', 'Destinations', 'Excursions', 'Payments', 'Fine Print', 'FAQs', 'Testimonials'];
const slug = s => s.toLowerCase().replaceAll(' ', '-');
const heroFiles = ['castle.jpg', 'country-side.jpg', 'town.jpg'];
const heroAlt = ['Bran Castle among forested hills', 'Romanian countryside', 'Historic Romanian town'];
const gallery = [['Sighișoara.jpg', 'Town of Sighișoara'], ['Unirii-Square.jpg', 'Unirii Square'], ['Romanian-Athenaeum.jpg', 'Romanian Athenaeum'], ['Bucharest-city.jpg', 'Bucharest City'], ['Bran-Castle.jpg', 'Bran Castle']];
const hotelFiles = [['exterior', 'Hotel Exterior'], ['guest-room', 'Guest Room'], ['lounge', 'Hotel Lounge'], ['pool-seating', 'Pool Seating Area'], ['pool', 'Hotel Pool'], ['bathroom', 'Private Bathroom']];
const dayLabel = day => paragraphs(day?.content)[0]?.replaceAll('Brasov', 'Brașov').replaceAll('Sighisoara', 'Sighișoara') || '';
const dayTags = ['Old Town · Palace of parliament · Cafés', 'Castles · Mountain scenery', 'Fortified churches · Medieval streets', 'Time to head home'];
const timelineLabels = [['City streets & architecture', 'Walking tour & Palace of Parliament', 'Old Town & historic churches'], ['Castles & the Carpathians', 'Citadel & historic centre', 'The Dracula legend'], ["Biertan’s fortified church", "Sibiu’s old city", 'Traditional dining']];

function Photo({ file, alt, className = '', ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [file]);
  return failed || !file ? <div className={'image-fallback ' + className} role="img" aria-label={alt || 'Image unavailable'}>Image unavailable</div> : <img src={picture(file)} alt={alt || ''} className={className} onError={() => setFailed(true)} {...props} />;
}

function SvgIcon({ name, className = '' }) {
  return <img className={'figma-icon ' + className} src={'/icons/' + encodeURIComponent(name) + '.svg'} alt="" aria-hidden="true" />;
}

function Chevron({ open }) {
  return <SvgIcon name="down arrow" className={open ? 'flipped' : ''} />;
}

function Heading({ label, children }) {
  return (<div className="heading">
    <span className="eyebrow">{label}</span>
    <h2>{children}</h2>
  </div>);
}

function Toggle({ open, onClick, children }) {
  return (<button type="button" className="toggle" aria-expanded={open} onClick={onClick}>{children} <span aria-hidden="true">
    <Chevron open={open} />
  </span></button>);
}

function useCarousel(length, delay, initialIndex = 0) {
  const [index, setIndex] = useState(initialIndex);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (length < 2 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return;
    const id = setInterval(() => setIndex(i => (i + 1) % length), delay);
    return () => clearInterval(id);
  }, [length, delay, paused]);
  return { index, setIndex, paused, setPaused };
}

function Hero({ deal, destination, nightCount, usp }) {
  const files = heroFiles.slice(0, deal.heroImages?.length ?? 0);
  const { index, setIndex } = useCarousel(files.length, 1500);
  const title = deal.title || '';
  const titleParts = title.match(/^(.*\bin)\s+(.+)$/i);
  const titleCase = text => text.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()).replace(/\bIn\b/g, 'in');
  return (<header className="hero">
    <div className="hero-images">
      {files.map((file, i) => <Photo key={file} file={file} alt={heroAlt[i]} className={i === index ? 'slide active' : 'slide'} aria-hidden={i !== index} loading="eager" />)}
    </div>
    <div className="brand">
      <b>Low<span>Cost</span>Vibes</b>
    </div>
    <HeroTools />
    <div className="hero-inner">
      <div className="hero-copy">
        <span className="hero-location">{destination} · {nightCount} nights</span>
        <h1>
          {titleParts ? <>{titleCase(titleParts[1])}{' '}<strong>{titleCase(titleParts[2])}</strong></> : title}
        </h1>
        <p>{usp}</p>
        <a className="hero-cta" href="#enquiry">Enquire about this holiday <span>
          <SvgIcon name="right_enquiry_Arrow" />
        </span></a>
      </div>
      <div className="price">
        <small>Starting From</small>
        <div><strong>
          {deal.price ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: deal.currency || 'GBP', maximumFractionDigits: 0 }).format(Number(deal.price)) : 'On request'}
        </strong> / Person</div>
        <small><SvgIcon name="two_people" /> {/two people sharing/i.test(plain(deal.finePrint)) ? 'Based on two people sharing' : ''}</small>
        <small><SvgIcon name="ant-design_info-circle-outlined" /> Subject to availability</small>
      </div>
    </div>
    <div className="hero-controls">
      {files.map((_, i) => <button key={i} className={i === index ? 'dot selected' : 'dot'} aria-label={`Show slide ${i + 1}`} aria-pressed={i === index} onClick={() => setIndex(i)} />)}
    </div>
  </header>);
}

function Navigation() {
  const [active, setActive] = useState('overview');
  useEffect(() => {
    const update = () => {
      let current = 'overview';
      for (const name of links) {
        const section = document.getElementById(slug(name));
        if (section && section.getBoundingClientRect().top <= (document.querySelector('.section-nav')?.offsetHeight || 0) + Math.max(48, window.innerHeight * .055 + 20))
          current = slug(name);
      }
      setActive(current);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (<nav className="section-nav" aria-label="Holiday sections">
    <div>
      {links.map(name => <a key={name} href={'#' + slug(name)} className={active === slug(name) ? 'current' : ''} aria-current={active === slug(name) ? 'location' : undefined}>{name}</a>)}
    </div>
  </nav>);
}

function OverviewPhoto({ image }) {
  const [file, caption] = image;
  return (<figure className="overview-photo">
    <Photo file={'overview-images/clean/' + file} alt={caption} />
    <figcaption>{caption}</figcaption>
  </figure>);
}

function Overview({ overview }) {
  const [open, setOpen] = useState(false);
  const p = paragraphs(overview?.content);
  const first = p[0] ?? '';
  const split = first.indexOf(' But if');
  const galleryText = p.slice(1).join(' ');
  const slogan = galleryText.indexOf('Our Low Cost Vibes');
  return (<section id="overview" className="overview section">
    <div>
      <Heading label="Overview">Discover the beauty and mystery of <b>Romania.</b></Heading>
      <p>
        {(split < 0 ? first : first.slice(0, split)).split(/(mountain landscapes|monasteries|Saxon towns of Transylvania)/g).map((part, i) => i % 2 ? <strong key={i} className="overview-emphasis">{part}</strong> : part)}
      </p>
      {open && split >= 0 && <p>{first.slice(split).trim()}</p>}
      <Toggle open={open} onClick={() => setOpen(!open)}>{open ? 'Read Less' : 'Read More'}</Toggle>
    </div>
    <div className="collage">
      <div className="collage-column collage-left">
        <OverviewPhoto image={gallery[0]} />
        <OverviewPhoto image={gallery[1]} />
      </div>
      <div className="collage-column collage-middle">
        <OverviewPhoto image={gallery[2]} />
        <div className="collage-copy">
          {slogan < 0 ? <p>{galleryText}</p> : <>
            <p>{galleryText.slice(0, slogan).trim()}</p>
            <strong>{galleryText.slice(slogan).trim()}</strong>
          </>}
        </div>
      </div>
      <div className="collage-column collage-right">
        <OverviewPhoto image={gallery[3]} />
        <OverviewPhoto image={gallery[4]} />
      </div>
    </div>
  </section>);
}

function hasBreakfast(deal) {
  return (deal.dealFAQs ?? []).some(f => /with breakfast/i.test(plain(f.answer)));
}

function Highlights({ deal }) {
  const hotel = deal.hotels?.[0];
  const nights = deal.dealDestinations?.[0]?.noOfNights;
  const list = items(deal.highlight?.content);
  const find = s => list.find(v => v.includes(s));
  const nearbyItems = label => items(deal.highlight?.content?.match(new RegExp(label + '[\\s\\S]*?<ul>([\\s\\S]*?)</ul>', 'i'))?.[1]);
  const breakfast = hasBreakfast(deal);
  const stay = list.find(text => /^Stay \d+ nights/i.test(text));
  const trip = find('Complimentary tour');
  const flight = find('Return flights');
  const included = [
    ['hotel', `${nights} nights at`, hotel ? `${hotel.name} ${'★'.repeat(Math.min(5, Number(hotel.rating) || 0))}` : '', stay && hotel && nights],
    ['Gift', 'Complimentary', trip?.replace(/^Complimentary tour:\s*/i, '').replace(/ from Bucharest$/i, '').replace('Day Trip', 'day trip'), trip],
    ['aeroplane', 'Return flights', flight?.replace(/^Return flights\s*/i, ''), flight],
    ['breakfast', 'Breakfast', 'Included', breakfast],
  ].filter(x => x[3]);
  return (<section id="highlights" className="section two-col highlights">
    <div>
      <Heading label="Highlights">Everything you need for a memorable <b>Romanian Escape.</b></Heading>
      <h3>What's included</h3>
      <div className="inclusions">
        {included.map(([icon, title, detail]) => <div key={icon}>
          <span className="inclusion-icon" aria-hidden="true">
            <SvgIcon name={icon} />
          </span>
          <div className="inclusion-text">
            <b>{title}</b>
            <span>{detail}</span>
          </div>
        </div>)}
      </div>
    </div>
    <div>
      <h3>Explore Nearby</h3>
      <div className="nearby">
        <div>
          <b><SvgIcon name="restaurant" /> Restaurants</b>
          <ul>{nearbyItems('Nearby Restaurants').map(x => <li key={x}>{x}</li>)}</ul>
        </div>
        <div>
          <b><SvgIcon name="location(nearby)" /> Attractions</b>
          <ul>{nearbyItems('Nearby Attractions').map(x => <li key={x}>{x}</li>)}</ul>
        </div>
      </div>
      <div className="good">
        <b>Good <br/> to know</b>
        <div>
          <p><SvgIcon name="Vector-7" /> {find('Regional airports')?.replace('upon request.', 'on request')}</p>
          <p><SvgIcon name="Vector-8" /> {find('Financially protected')}{/protected under ATOL/i.test(plain(deal.finePrint)) ? ' under ATOL' : ''}</p>
        </div>
      </div>
    </div>
  </section>);
}

function DayContent({ day, index }) {
  const parts = paragraphs(day?.content).slice(1);
  if (index === 0 && parts.length === 3) {
    const at = parts[1].indexOf('A Bucharest walking tour');
    if (at >= 0) {
      parts[0] += ' ' + parts[1].slice(0, at);
      parts[1] = parts[1].slice(at);
    }
  }
  if (index === 1 && parts.length === 2) {
    const at = parts[0].indexOf('Explore Rasnov');
    if (at >= 0) {
      parts.splice(1, 0, parts[0].slice(at));
      parts[0] = parts[0].slice(0, at);
    }
  }
  return (<div className="timeline">
    {parts.map((p, i) => <div key={i}>
      <h4>{(index === 3 ? p : timelineLabels[index]?.[i]) || 'Explore'}</h4>
      {index !== 3 && <p>{p.replace(/\bBeitrag\b/g, 'Biertan')}</p>}
    </div>)}
  </div>);
}

function Itinerary({ days = [] }) {
  const [selected, setSelected] = useState(0);
  const [mobile, setMobile] = useState(-1);
  return (<section id="itinerary" className="section itinerary">
    <div>
      <Heading label="Itinerary">A thoughtful plan<br/> for <b>everyday.</b></Heading>
      <p className="intro">Four days.<br/>Iconic cities, historic towns and <br/> unforgettable experiences.</p>
      <div className="day-list">
        {days.map((d, i) => <button key={d.id} className={selected === i ? 'day chosen' : 'day'} onClick={() => setSelected(i)} aria-pressed={selected === i}>
          <span>Day {d.day}</span>
          <div>
            <b>{dayLabel(d)}</b>
            <small>{dayTags[i]}</small>
          </div>
          <i>
            <SvgIcon name="left blue arrow" />
          </i>
        </button>)}
      </div>
    </div>
    <div className="day-detail">
      {days.length > 0 && <>
        <b>DAY {days[selected]?.day}</b>
        <h3>{dayLabel(days[selected])}</h3>
        <small>{dayTags[selected]}</small>
        <DayContent day={days[selected]} index={selected} />
      </>}
    </div>
    <div className="mobile-days">
      {days.map((d, i) => <div key={d.id}>
        <button className="day" aria-expanded={mobile === i} onClick={() => setMobile(mobile === i ? -1 : i)}>
          <span>Day {d.day}</span>
          <div>
            <b>{dayLabel(d)}</b>
            <small>{dayTags[i]}</small>
          </div>
          <i>
            <Chevron open={mobile === i} />
          </i>
        </button>
        {mobile === i && <DayContent day={d} index={i} />}
      </div>)}
    </div>
  </section>);
}

function Amenities({ hotel }) {
  const [open, setOpen] = useState(false);
  const all = [items(hotel.amenities), items(hotel.roomAmenities)];
  const preview = [['Free Internet (WiFi)', 'Restaurant', '24-hour front desk'], ['Air conditioning', 'Minibar', 'Private bathrooms']];
  return (<div className="amenities">
    <h3>Amenities</h3>
    <div className={open ? 'amenity-body expanded' : 'amenity-body'}>
      {all.map((list, i) => <div key={i}>
        <h4>{i ? 'In your room' : 'At the hotel'}</h4>
        <ul>
          {(open ? list : preview[i].filter(x => list.includes(x))).map(x => <li key={x}>{x}</li>)}
        </ul>
      </div>)}
    </div>
    <div className="amenity-footer">
      <Toggle open={open} onClick={() => setOpen(!open)}>{open ? 'Show fewer amenities' : 'View all amenities'}</Toggle>
    </div>
  </div>);
}

function Hotel({ hotel, destination, nights, breakfast }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  if (!hotel)
    return (<section id="hotel" className="section">
      <Heading label="Hotel">Accommodation details unavailable</Heading>
    </section>);
  const photos = hotelFiles.slice(0, hotel.images?.length ?? 0);
  const text = plain(hotel.description);
  const cut = text.indexOf(' The hotel boasts');
  const shown = open || cut < 0 ? text : text.slice(0, cut);
  const photo = photos[index];
  return (<section id="hotel" className="section">
    <div className="hotel-top">
      <div>
        <Heading label="Hotel">A <span className="hotel-tagline-regular">relaxing stay</span><br/> between<br/> moments of discovery.</Heading>
        <p className="muted hotel-location"><SvgIcon name="hotel_location" /> {destination}</p>
        <h3 className="hotel-name">{hotel.name} <span aria-label={`${hotel.rating} stars`}>{'★'.repeat(Math.min(5, Number(hotel.rating) || 0))}</span></h3>
        <span className="pill">{nights} nights{breakfast ? ' · Breakfast included' : ''}</span>
      </div>
      <div className="hotel-gallery">
        <div className="hotel-main">
          <Photo file={photo && `Hotel/parliament-hotel-${photo[0]}.png`} alt={photo?.[1]} />
          <span>{photo?.[1]}</span>
        </div>
        <div className="thumbnails">
          {photos.map(([f, a], i) => <button key={f} onClick={() => setIndex(i)} aria-label={`Show ${a}`} aria-pressed={i === index}>
            <Photo file={`Hotel/parliament-hotel-${f}.png`} alt={a} />
            <span className="thumbnail-expand" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
              </svg>
            </span>
          </button>)}
        </div>
      </div>
    </div>
    <p>{shown}</p>
    {cut >= 0 && <Toggle open={open} onClick={() => setOpen(!open)}>{open ? 'Read Less' : 'Read More'}</Toggle>}
    <Amenities hotel={hotel} />
  </section>);
}

function Destination({ destinations = [] }) {
  return (<section id="destinations" className="section">
    {destinations.map((d, i) => <div key={d.destinationId ?? i}>
      <div className="destination-head">
        <Heading label="Destination">Where <b>history, culture,</b> and <b>beauty<br/> come together.</b></Heading>
        <div>
          <span className="pill">{d.noOfNights} nights</span>
          <h3>{d.destination?.name}, {d.destination?.country}</h3>
          <small>Your base for the included Transylvania day trip</small>
        </div>
      </div>
      <Photo file="bucharest-destination.jpg" alt="Bucharest city skyline at dusk" className="destination-image" />
    </div>)}
  </section>);
}

function Excursions({ html }) {
  const list = [...new Set(items(html))];
  const castlePrice = list.find(x => /Dracula's Castle/i.test(x))?.match(/£\d+(?:\.\d+)?/)?.[0];
  return (<section id="excursions" className="section two-col">
    <div>
      <Heading label="Excursions">A little more adventure,<br/> <b>beyond the itinerary.</b></Heading>
      <Photo file="default-excursions.webp" alt="A collage of optional holiday activities" className="wide-photo" />
      <small className="muted">Optional activities are priced per person.</small>
    </div>
    <div className="excursion-list">
      {list.map(x => {
        const [name, price] = x.split(/\s+-\s+(?=£)/);
        return (<div className="excursion" key={x}>
          <span>{name.replace(/^Bucharest: /, '')}</span>
          <b>{price?.replace('pp', ' pp')}</b>
        </div>);
      })}
      {castlePrice && <p className="notice">Your package includes a complimentary Transylvania day trip. Before booking the {castlePrice} optional excursion, ask us which stops and entrance fees each tour includes.</p>}
    </div>
  </section>);
}

function Payment({ html }) {
  const labels = ['Initial deposit', 'Monthly instalments', 'Final payment'];
  const steps = items(html);
  const p = paragraphs(html);
  const note = p[1] || '';
  const noteBreak = note.indexOf('Low Cost Vibes expert.');
  return (<section id="payments" className="section two-col">
    <div>
      <Heading label="Payment">Low deposit and<br/> <b>monthly instalments</b></Heading>
      <Photo file="paymentImage.webp" alt="Payment method logos from the supplied assessment asset" className="wide-photo" />
      <small className="muted">{p[0]}</small>
    </div>
    <div className="payment-list">
      {steps.map((x, i) => <div key={x}>
        <span className="pill">{x.match(/\d+(?:\.\d+)?%/)?.[0] || (/monthly/i.test(x) ? 'Monthly' : '')}</span>
        <div>
          <b>{labels[i]}</b>
          <p>{x}</p>
        </div>
      </div>)}
      <p className="dark-note">{noteBreak < 0 ? note : <>{note.slice(0, noteBreak).trim()}<br/>{note.slice(noteBreak)}</>}</p>
    </div>
  </section>);
}
const conditionGroups = [
  ['Price and availability', [/^Price is based/, /^Lowest price/, /^Rates may vary/]],
  ['Luggage and tourist tax', [/^Hand luggage/, /^City\/Tourist tax/]],
  ['Financial protection', [/financially protected under ATOL/i]],
  ['Flights and travel documents', [/^Outbound flights/, /^You will receive all documents/]],
  ['Passports and age requirements', [/^Travelers name/, /^If your passport information/, /^For a family or group/]],
  ['Entry requirements', [/^Due to COVID-19/]],
  ['Medical conditions and reduced mobility', [/^If you have a medical condition/]],
  ['Booking terms', [/^This offer shown/]],
];

function FinePrint({ html }) {
  const [open, setOpen] = useState(false);
  const list = items(html);
  const group = ([title, patterns]) => <div className="condition" key={title}>
    <h4>{title}</h4>
    <ul>
      {patterns.flatMap(pattern => list.filter(text => pattern.test(text))).map(text => <li key={text}>
        {text}
        {/^Due to COVID-19/.test(text) && <p>
          <a href="https://www.gov.uk/foreign-travel-advice" target="_blank" rel="noreferrer">Check the latest UK foreign travel advice ↗</a>
        </p>}
      </li>)}
    </ul>
  </div>;
  return (<section id="fine-print" className="section">
    <div className="two-col fine-head">
      <Heading label="Fine Print">The little details that <b>matter.</b></Heading>
      <Photo file="finePrintImage.jpg" alt="Travellers planning a trip using a map" className="wide-photo" />
    </div>
    <div className="two-col conditions">
      <div>{(open ? conditionGroups.slice(0, 5) : conditionGroups.slice(0, 1)).map(group)}</div>
      <div>{(open ? conditionGroups.slice(5) : conditionGroups.slice(1, 3)).map(group)}</div>
    </div>
    <Toggle open={open} onClick={() => setOpen(!open)}>{open ? 'Hide additional conditions' : 'View All Conditions'}</Toggle>
  </section>);
}

function FAQs({ faqs = [] }) {
  const [open, setOpen] = useState(null);
  return (<section id="faqs" className="section faq-layout">
    <Heading label="FAQs">A <b>few things</b> you<br/> might be wondering.</Heading>
    <div className="faq-list">
      {faqs.map((f, i) => <div key={f.id ?? i} className={open === i ? 'faq opened' : 'faq'}>
        <h3>
          <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-controls={`answer-${i}`}>
            {f.question}
            <span>
              <Chevron open={open === i} />
            </span>
          </button>
        </h3>
        <div id={`answer-${i}`} hidden={open !== i} className="answer">{plain(f.answer)}</div>
      </div>)}
    </div>
  </section>);
}
const reviews = [['Emma', 'I wasn’t sure when the payments were due. Our travel consultant talked us through the deposit and instalments, so we knew what to expect.'], ['Anna', 'It was our first time booking a package holiday. The team told us what passport details they needed and when to expect our travel documents.'], ['Priya', 'We had a few questions about the included Transylvania day trip. Our consultant explained what it covered and which excursions we could add separately.'], ['David', 'The travel consultant explained the payment plan and when the instalments would be due.'], ['Angela', 'We wanted to fly from an airport closer to home. The team explained which regional airports we could fly from and what the difference in price would be.']];

function Testimonials() {
  const { index, setIndex, setPaused } = useCarousel(reviews.length, 4500, 1);
  const colors = ['#c8e8fa', '#e9faad', '#fff4c4', '#e9bbfa', '#e9faad'];
  const move = offset => setIndex(i => (i + offset + reviews.length) % reviews.length);
  return (<section id="testimonials" className="section faq-layout testimonials">
    <Heading label="Customer Testimonials"><b>Reassurance</b> for your<br/>next big adventure.</Heading>
    <div className="testimonial-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={e => {
      if (!e.currentTarget.contains(e.relatedTarget))
        setPaused(false);
    }}>
      <div className="reviews">
        {[-1, 0, 1].map(offset => {
          const i = (index + offset + reviews.length) % reviews.length;
          return (<article key={offset} className={offset === 0 ? 'review featured' : 'review'}>
            {offset !== 0 && <button type="button" className={'review-arrow ' + (offset < 0 ? 'previous' : 'next')} aria-label={offset < 0 ? 'Previous testimonial' : 'Next testimonial'} onClick={() => move(offset)}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d={offset < 0 ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>}
            <span className="avatar" style={{ background: colors[i] }}>{reviews[i][0][0]}</span>
            <b>{reviews[i][0]}</b>
            <p>{reviews[i][1]}</p>
          </article>);
        })}
      </div>
    </div>
  </section>);
}

function Enquiry() {
  const [sent, setSent] = useState(false);
  return (<section id="enquiry" className="section two-col enquiry">
    <Heading label="Enquire about this holiday">Have a question about the trip?<br/><b>Tell us what you'd like to know.</b></Heading>
    <form onSubmit={e => {
      e.preventDefault();
      const form = e.currentTarget;
      const values = new FormData(form);
      if (!String(values.get('name')).trim() || !String(values.get('message')).trim()) {
        form.reportValidity();
        return;
      }
      setSent(true);
      form.reset();
    }}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" required pattern=".*\S.*" autoComplete="name" />
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required autoComplete="email" />
      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" required rows={5} onChange={e => e.target.setCustomValidity(e.target.value.trim() ? '' : 'Please enter a message.')} />
      <button type="submit">Send Enquiry</button>
      <p role="status">
        {sent ? 'Thank you! Your demo enquiry has been completed. No information was sent or stored.' : ''}
      </p>
    </form>
  </section>);
}

function HeroTools() {
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    try {
      setDark(localStorage.getItem('holiday-theme') === 'dark');
    }
    catch { }
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem('holiday-theme', next ? 'dark' : 'light');
    }
    catch { }
  }
  useEffect(() => {
    if (!menu)
      return;
    const close = (event) => {
      if (event.key === 'Escape')
        setMenu(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menu]);
  return (<div className="hero-tools">
    <button type="button" onClick={toggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dark ? <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </> : <path d="M20.9 13.3A9 9 0 0 1 10.7 3.1 9 9 0 1 0 20.9 13.3Z" />}
      </svg>
    </button>
    <button type="button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="hero-menu" aria-label={menu ? 'Close navigation' : 'Open navigation'}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d={menu ? 'M5 5l14 14M19 5L5 19' : 'M3 6h18M3 12h18M3 18h18'} />
      </svg>
    </button>
    <nav id="hero-menu" className="hero-menu" aria-label="Quick navigation" hidden={!menu}>
      {links.map(name => <a key={name} href={'#' + slug(name)} onClick={() => setMenu(false)}>{name}</a>)}
      <a href="#enquiry" onClick={() => setMenu(false)}>Enquire about this holiday</a>
    </nav>
  </div>);
}

function FloatingEnquiry() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('.hero');
    const enquiry = document.getElementById('enquiry');
    if (!hero || !enquiry)
      return;
    function updateVisibility() {
      setVisible(hero.getBoundingClientRect().bottom <= 0 && enquiry.getBoundingClientRect().top >= window.innerHeight);
    }
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    const observer = new ResizeObserver(updateVisibility);
    observer.observe(hero);
    observer.observe(document.body);
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
      observer.disconnect();
    };
  }, []);
  return (<a href="#enquiry" className={`floating-enquiry ${visible ? 'visible' : ''}`} tabIndex={visible ? 0 : -1} aria-hidden={!visible}>
    Enquire about this holiday
    <span>
      <SvgIcon name="right_enquiry_Arrow" />
    </span>
  </a>);
}

export default function DealPage({ deal }) {
  const destination = deal.dealDestinations?.[0];
  const location = [destination?.destination?.name, destination?.destination?.country].filter(Boolean).join(', ');
  const nights = destination?.noOfNights;
  const tour = items(deal.highlight?.content).find(x => /^Complimentary tour:/i.test(x));
  const usp = tour ? tour.replace(/^Complimentary tour:\s*/i, 'Complimentary ').replace(/ from Bucharest$/i, '').replace('Day Trip', 'day trip') + ' included' : '';
  return (<>
    <a href="#overview" className="skip">Skip to holiday details</a>
    <Hero deal={deal} destination={location} nightCount={nights} usp={usp} />
    <Navigation />
    <main>
      <Overview overview={deal.overview} />
      <Highlights deal={deal} />
      <Itinerary days={deal.itineraries ?? []} />
      <Hotel hotel={deal.hotels?.[0]} destination={location} nights={nights} breakfast={hasBreakfast(deal)} />
      <Destination destinations={deal.dealDestinations ?? []} />
      <Excursions html={deal.excursions} />
      <Payment html={deal.payment} />
      <FinePrint html={deal.finePrint} />
      <FAQs faqs={deal.dealFAQs ?? []} />
      <Testimonials />
      <Enquiry />
    </main>
    <FloatingEnquiry />
    <a href="#enquiry" className="mobile-cta">Enquire about this holiday <SvgIcon name="right_enquiry_Arrow" /></a>
  </>);
}
