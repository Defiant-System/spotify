
// spotify.coverflow

{
	init() {
		// fast references
		this.els = {
			body: window.find(".view-body"),
		};

		// defaults
		this.vars = {
			pressed: false,
			cTime: 250,
			dim: 110,
			center: 0,
			radius: 5,
			offset: 0,
			target: 0,
			angle: -53,
			dist: -250,
			shift: 20,
			images: [],
			count: 0,
			ticker: false,
		};
	},
	dispatch(event) {
		let Self = spotify.coverflow,
			Vars = Self.vars,
			cX,
			el;
		switch (event.type) {
			// custom events
			case "init-coverflow":
				Self.els.coverflow = Self.els.body.find(".coverflow");
				Self.vars.images = Self.els.coverflow.find(".cover");
				Self.vars.count = Self.vars.images.length;
				Self.vars.innerWidth = Self.els.coverflow.width();
				Self.vars.innerHeight = Self.els.coverflow.height();
				el = Self.els.coverflow.find(".cover");
				Self.vars.coverWidth = el.width();
				Self.vars.coverHeight = el.height();
				// default ui setup
				Self.scroll(0);
				// bind event handlers
				Self.els.coverflow.bind("mousedown", Self.dispatch);
				break;
			// native events
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();
				event.stopPropagation();

				// mousedown info
				Self.vars.pressed = true;
				Self.vars.reference = event.clientX;
				Self.vars.velocity = 0;
				Self.vars.amplitude = 0;
				Self.vars.frame = Vars.offset;
				Self.vars.timeStamp = Date.now();
				Self.vars.innerWidth = Self.els.coverflow.width();
				Self.vars.innerHeight = Self.els.coverflow.height();

				clearInterval(Vars.ticker);
				Vars.ticker = setInterval(Self.track.bind(Self), 100);
				// remove center from centered child
				Self.els.coverflow.find(".center").removeClass("center");
				// bind event handlers
				Self.els.coverflow.bind("mousemove mouseup", Self.dispatch);
				return false;
			case "mousemove":
				cX = event.clientX;
				Vars.delta = Vars.reference - cX;

				if (Vars.delta > 2 || Vars.delta < -2) {
					Vars.reference = cX;
					Self.scroll(Vars.offset + Vars.delta);
				}
				break;
			case "mouseup":
				Vars.pressed = false;
				clearInterval(Vars.ticker);

				Vars.target = Vars.offset;
				if (Vars.velocity > 10 || Vars.velocity < -10) {
					Vars.amplitude = 0.9 * Vars.velocity;
					Vars.target = Vars.offset + Vars.amplitude;
				}
				Vars.target = Math.round(Vars.target / Vars.dim) * Vars.dim;
				Vars.amplitude = Vars.target - Vars.offset;
				Vars.timeStamp = Date.now();
				requestAnimationFrame(Self.autoScroll.bind(Self));

				// unbind event handlers
				Self.els.coverflow.unbind("mousemove mouseup", Self.dispatch);
				break;
		}
	},
	scroll(x) {
		let wrap = x => (x >= count) ? (x % count) : (x < 0) ? wrap(count + (x % count)) : x,
			Vars = this.vars,
			count = Vars.count,
			images = Vars.images,
			delta,
			dir,
			tween,
			opacity = 1,
			alignment,
			transform;

		Vars.offset = (typeof x === 'number') ? x : Vars.offset;
		Vars.center = Math.floor((Vars.offset + Vars.dim / 2) / Vars.dim);
		delta = Vars.offset - Vars.center * Vars.dim;
		Vars.dir = (delta < 0) ? 1 : -1;
		tween = -Vars.dir * delta * 2 / Vars.dim;
		alignment = `translateX(${(Vars.innerWidth - Vars.coverWidth) / 2}px)
					translateY(${(Vars.innerHeight - Vars.coverHeight - 20) / 2}px)`;

		// center
		transform = `${alignment}
					translateX(${-delta / 2}px)
					translateX(${Vars.dir * (Vars.shift + 50) * tween}px)
					translateZ(${(Vars.dist * tween)}px)
					rotateY(${(Vars.dir * Vars.angle * tween)}deg)`;
		images.get(wrap(Vars.center)).css({ transform, opacity, zIndex: 0 });

		for (let i=1, half=count>>1; i<=half; ++i) {
			// right side
			transform = `${alignment}
							translateX(${Vars.shift + (Vars.dim * i - delta + 100) / 1.75}px)
							translateZ(${Vars.dist}px) rotateY(${Vars.angle}deg)`;
			opacity = (i === Vars.radius && delta < 0) ? 1 - tween : 1;
			if (i > Vars.radius) opacity = 0;
			images.get(wrap(Vars.center + i)).css({ transform, opacity, zIndex: -i });

			// left side
			transform = `${alignment}
							translateX(${-Vars.shift + (-Vars.dim * i - delta - 100) / 1.75}px)
							translateZ(${Vars.dist}px) rotateY(${-Vars.angle}deg)`;
			opacity = (i === Vars.radius && delta > 0) ? 1 - tween : 1;
			if (i > Vars.radius) opacity = 0;
			images.get(wrap(Vars.center - i)).css({ transform, opacity, zIndex: -i });
		}
	},
	track() {
		let Vars = this.vars,
			now = Date.now(),
			elapsed = now - Vars.timestamp,
			delta = Vars.offset - Vars.frame;

		Vars.timestamp = now;
		Vars.frame = Vars.offset;

		let v = 1000 * delta / (1 + elapsed);
		Vars.velocity = 0.8 * v + 0.2 * Vars.velocity;
	},
	autoScroll() {
		let Vars = this.vars;
		if (Vars.amplitude) {
			let elapsed = Date.now() - Vars.timestamp,
				delta = Vars.amplitude * Math.exp(-elapsed / Vars.cTime);
			if (delta > 4 || delta < -4) {
				this.scroll(Vars.target - delta);
				requestAnimationFrame(this.autoScroll.bind(this));
			} else {
				this.scroll(Vars.target);

				let len = Vars.images.length,
					item = ((len * 10) + (Vars.target / Vars.dim)) % len;
				Vars.images.get(item).addClass("center")
			}
		}
	}
}
