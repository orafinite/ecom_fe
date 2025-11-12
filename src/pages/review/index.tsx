import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Field, FieldLabel, FieldContent } from '../../components/ui/field';
import { Input } from '../../components/ui/input';

type Review = {
	id: string;
	name: string;
	date: string;
	rating: number; // 1-5
	comment: string;
	avatar?: string;
};
// Reviews will be loaded from public/review.json

function Stars({ value }: { value: number }) {
	return (
		<div className="inline-flex items-center text-yellow-500">{
			Array.from({ length: 5 }).map((_, i) => (
				<svg
					key={i}
					viewBox="0 0 20 20"
					fill={i < value ? 'currentColor' : 'none'}
					stroke="currentColor"
					className={`w-4 h-4 ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}
					aria-hidden
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
				</svg>
			))
		}</div>
	);
}

export default function ReviewPage() {
	const [showAll, setShowAll] = useState<boolean>(false);
	const [filterRating, setFilterRating] = useState<number>(0); 
	const [sortMode, setSortMode] = useState<'newest' | 'highest' | 'lowest'>('newest');
	const [helpfulSet, setHelpfulSet] = useState<Record<string, boolean>>({});
	const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});
	const [reviews, setReviews] = useState<Review[]>([]);

	// sheet/open state and form state
	const [sheetOpen, setSheetOpen] = useState(false);
	const [formName, setFormName] = useState('');
	const [formRating, setFormRating] = useState<number>(5);
	const [formComment, setFormComment] = useState('');

	useEffect(() => {
		// try to load from API first (when running). If API isn't available, fall back to localStorage and bundled reviews.
		fetch('http://localhost:4000/api/reviews')
			.then((r) => {
				if (!r.ok) throw new Error('no api');
				return r.json();
			})
			.then((data) => {
				if (Array.isArray(data)) {
					setReviews(data);
					try { localStorage.setItem('reviews', JSON.stringify(data)); } catch {}
				}
			})
			.catch(() => {
				// API not available, fallback to localStorage then bundled
				try {
					const stored = localStorage.getItem('reviews');
					if (stored) {
						setReviews(JSON.parse(stored));
						return;
					}
				} catch (e) {}
				fetch('/review.json')
					.then((r) => r.json())
					.then((data) => setReviews(Array.isArray(data) ? data : []))
					.catch(() => setReviews([]));
			});
	}, []);

	useEffect(() => {
		// ensure helpfulCounts has an entry for each review
		const counts = reviews.reduce((acc, r) => {
			acc[r.id] = acc[r.id] ?? 0;
			return acc;
		}, {} as Record<string, number>);
		setHelpfulCounts(counts);
	}, [reviews]);
	const avg = (
		(reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0)
	).toFixed(1);

		// compute rating breakdown and filtered/sorted reviews
		const ratingCounts = [5, 4, 3, 2, 1].map((star) =>
			reviews.filter((r) => r.rating === star).length
		);

		let visible = reviews.filter((r) => (filterRating > 0 ? r.rating === filterRating : true));

		visible = visible.sort((a, b) => {
			if (sortMode === 'highest') return b.rating - a.rating;
			if (sortMode === 'lowest') return a.rating - b.rating;
			// newest: parse date strings
			const da = Date.parse(a.date);
			const db = Date.parse(b.date);
			return db - da;
		});

		const reviewsToShow = showAll ? visible : visible.slice(0, 5);

		// handler to submit the form
		async function handleSubmit(e?: React.FormEvent) {
			e?.preventDefault?.();
			if (!formName || !formComment || !formRating) return;
			const newReview: Review = {
				id: 'r' + Date.now(),
				name: formName,
				date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
				rating: formRating,
				comment: formComment,
				avatar: undefined,
			};

			// Try to persist to API first. If successful, use saved value from server. If API fails, fall back to optimistic local add.
			try {
				const resp = await fetch('http://localhost:4000/api/reviews', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newReview),
				});
				if (resp.ok) {
					const saved = await resp.json();
					setReviews((s) => [saved, ...s]);
					try { localStorage.setItem('reviews', JSON.stringify([saved, ...reviews])); } catch {}
				} else {
					// fallback
					setReviews((s) => [newReview, ...s]);
					try { localStorage.setItem('reviews', JSON.stringify([newReview, ...reviews])); } catch {}
				}
			} catch (err) {
				// network error - fallback to local
				setReviews((s) => [newReview, ...s]);
				try { localStorage.setItem('reviews', JSON.stringify([newReview, ...reviews])); } catch {}
			}

			// reset form and close modal
			setFormName('');
			setFormRating(5);
			setFormComment('');
			setSheetOpen(false);
		}

	return (
		<div className="max-w-5xl mx-auto p-6 ">
			<div className="mb-6">
				<h2 className="text-2xl font-bold">Customer reviews</h2>
				<p className="text-sm text-gray-500">Read what other customers are saying about our products.</p>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				<Card className="md:col-span-1 max-h-50">
					<CardHeader>
						<CardTitle>Overall rating</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-3">
							<div className="text-4xl font-bold">{avg}</div>
							<div className="flex flex-col">
								<div className="flex items-center gap-2">
									<Stars value={Math.round(Number(avg))} />
								</div>
								<div className="text-sm text-gray-500">{reviews.length} reviews</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="ghost" onClick={() => setSheetOpen(true)}>Write a review</Button>

						{sheetOpen && (
							<div className="fixed inset-0 z-50 flex items-center justify-center">
								<div className="absolute inset-0 bg-black/40" onClick={() => setSheetOpen(false)} />
								<div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
									<div className="flex items-start justify-between">
											<div className="text-foreground font-semibold">Write a review</div>
											<Button variant="ghost" onClick={() => setSheetOpen(false)}>X</Button>
										</div>
									<form onSubmit={handleSubmit} className="p-2 flex flex-col gap-4">
										<Field>
											<FieldLabel>Name</FieldLabel>
											<FieldContent>
												<Input value={formName} onChange={(e) => setFormName(e.target.value)} />
											</FieldContent>
										</Field>

										<Field>
											<FieldLabel>Rating</FieldLabel>
											<FieldContent>
												<select className="rounded border px-2 py-1 text-sm w-full" value={formRating} onChange={(e) => setFormRating(Number(e.target.value))}>
													{[5,4,3,2,1].map((s) => (
														<option key={s} value={s}>{s}★</option>
													))}
												</select>
											</FieldContent>
										</Field>

										<Field>
											<FieldLabel>Review</FieldLabel>
											<FieldContent>
												<textarea value={formComment} onChange={(e) => setFormComment(e.target.value)} className="w-full rounded border px-3 py-2" rows={6} />
											</FieldContent>
										</Field>

										<div className="flex items-center justify-end gap-2">
											<Button variant="ghost" type="button" onClick={() => setSheetOpen(false)}>Cancel</Button>
											<Button type="submit">Submit review</Button>
										</div>
									</form>
								</div>
							</div>
						)}
					</CardFooter>
				</Card>

						<div className="md:col-span-2 space-y-4">
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-600">Filter:</span>
									<div className="inline-flex gap-1">
										<Button size="sm" variant={filterRating === 0 ? 'default' : 'ghost'} onClick={() => setFilterRating(0)}>All</Button>
										{[5,4,3,2,1].map((s) => (
											<Button key={s} size="sm" variant={filterRating === s ? 'default' : 'ghost'} onClick={() => setFilterRating(filterRating === s ? 0 : s)}>{s}★</Button>
										))}
									</div>
								</div>

								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-600">Sort:</span>
									<select className="rounded border px-2 py-1 text-sm" value={sortMode} onChange={(e) => setSortMode(e.target.value as any)}>
										<option value="newest">Newest</option>
										<option value="highest">Highest rating</option>
										<option value="lowest">Lowest rating</option>
									</select>
								</div>
							</div>

							{/* rating breakdown */}
							<div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-2">
								{[5,4,3,2,1].map((star, idx) => {
									const count = ratingCounts[idx];
									const pct = Math.round((count / (reviews.length || 1)) * 100) || 0;
									return (
										<div key={star} className="flex items-center gap-2 text-sm">
											<div className="w-6 text-xs">{star}★</div>
											<div className="flex-1 bg-gray-100 h-2 rounded overflow-hidden">
												<div className="bg-primary h-2" style={{ width: `${pct}%` }} />
											</div>
											<div className="w-8 text-right text-xs text-gray-500">{count}</div>
										</div>
									);
								})}
							</div>

							{reviewsToShow.map((r) => (
									<article key={r.id} className="bg-card text-card-foreground flex gap-4 rounded-xl p-4 border shadow-sm">
										<div className="shrink-0">
								<Avatar>
									{r.avatar ? <AvatarImage src={r.avatar} alt={r.name} /> : <AvatarFallback>{r.name.charAt(0)}</AvatarFallback>}
								</Avatar>
							</div>

							<div className="flex-1">
								<div className="flex items-start justify-between">
									<div>
										<div className="text-sm font-medium">{r.name} <span className="text-xs text-gray-500">· {r.date}</span></div>
										<div className="mt-1"><Stars value={r.rating} /></div>
									</div>
														<div className="self-start flex flex-col items-end gap-2">
															<Badge>{r.rating}★</Badge>
															<div>
																<Button
																	size="sm"
																	variant={helpfulSet[r.id] ? 'default' : 'ghost'}
																	onClick={() => {
																		setHelpfulSet((s) => ({ ...s, [r.id]: !s[r.id] }));
																		setHelpfulCounts((c) => ({ ...c, [r.id]: (c[r.id] || 0) + (helpfulSet[r.id] ? -1 : 1) }));
																	}}
																>
																	Helpful ({helpfulCounts[r.id] ?? 0})
																</Button>
															</div>
														</div>
								</div>

								<p className="mt-3 text-gray-700">{r.comment}</p>
							</div>
						</article>
						))}

						{reviews.length > 5 && (
							<div className="mt-4 flex justify-center">
								<Button variant="link" onClick={() => setShowAll((s) => !s)}>
									{showAll ? 'View less' : `View more (${reviews.length - 5})`}
								</Button>
							</div>
						)}
				</div>
			</div>
		</div>
	);
}

