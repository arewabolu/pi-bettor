const delta  = 2.5
const gamma  = 0.79  //0.70
const lambda = 0.054 //  0.035/
const Mu     = 0.01
const phi    = 1 //form factor


export class Team {
	constructor(
	public name: string,
	public backgroundHomeRating: number,
	public backgroundAwayRating: number,
	// Continuous Performance values are a measure of a team's recent form at home
	private continuousPerformanceHome: number,
	// Continuous Performance values are a measure of a team's recent form at away
	private continuousPerformanceAway: number,     
	){}
	//constructor(name: string, backgroundHomeRating?: number, backgroundAwayRating?: number, continuousPerformanceHome?: number, continuousPerformanceAway?: number){
    //    this.name=name;
	//	this.backgroundHomeRating=backgroundHomeRating;
	//	this.backgroundAwayRating=backgroundAwayRating;
	//	this.continuousPerformanceHome=continuousPerformanceHome;
	//	this.continuousPerformanceAway=continuousPerformanceAway;
    //}

	copy(): Team {
		return new Team(this.name, this.backgroundHomeRating, this.backgroundAwayRating, this.continuousPerformanceHome,this.continuousPerformanceAway);
	  }

	calcProvisionalRatingHome() : number {
		const sub = this.continuousPerformanceHome - 1
		const denum = Math.pow(sub,delta)
		const total = sub / denum
		return this.backgroundHomeRating + (Mu * total)
	}
	
	calcProvisionalRatingAway()  {
		const sub = this.continuousPerformanceAway - 1
		const total = sub / (Math.pow(Math.abs(sub), delta))
		return this.backgroundAwayRating + (-Mu * total)
	}
	
	calcProvisionalRatingAwayV2()  {
		const sub = this.continuousPerformanceAway - 1
		const total = sub / (Math.pow(sub, delta))
		return this.backgroundAwayRating + (Mu * total)
	}
	
	calcProvisionalRatingHomeV2() {
		const sub = this.continuousPerformanceHome - 1
		const total = sub / Math.pow(Math.abs(sub), delta)
		return this.backgroundHomeRating + (-Mu * total)
	}
	
	// Should be used to incorporate form into the team ratings
	provisionalRating(venue: string): Team {
		let newTeam= this.copy()
		if (venue.toLowerCase()==='away') {
			if (this.continuousPerformanceAway > 1) {
				newTeam.backgroundAwayRating = this.calcProvisionalRatingAwayV2();
			} else if (this.continuousPerformanceAway < -1) {
				newTeam.backgroundAwayRating = this.calcProvisionalRatingAway();
			}
		} else if (venue.toLowerCase()=== 'home') {
			if (this.continuousPerformanceHome > 1) {
				newTeam.backgroundHomeRating = this.calcProvisionalRatingHome();
			} else if (this.continuousPerformanceHome < -1) {
				newTeam.backgroundHomeRating = this.calcProvisionalRatingHomeV2();
			}
		}
		return newTeam
	}
	
	// revises home and away background ratings for a given team
	updateBackgroundHometeamRatings (errorGDFunc) {
		let BHR = this.backgroundHomeRating + (errorGDFunc * lambda)
		let BAR= this.backgroundAwayRating + ((BHR - this.backgroundHomeRating) * gamma)
		this.backgroundHomeRating = BHR
		this.backgroundAwayRating = BAR
	}
	
	// revises home and away background ratings for a given team
	updateBackgroundAwayteamRatings(errorGDFunc: number) {
		let BAR = this.backgroundAwayRating + (errorGDFunc * lambda)
		let BHR = this.backgroundHomeRating + ((BAR - this.backgroundAwayRating) * gamma)
		this.backgroundAwayRating = BAR
		this.backgroundHomeRating = BHR
	}
	
	resetContinuousPerformanceHome() { 
		return this.continuousPerformanceHome = 0
	}
	
	resetContinuousPerformanceAway() {
		this.continuousPerformanceAway = 0
	}
	
	updateContinuousPerformanceHome() {
		this.continuousPerformanceHome = this.continuousPerformanceHome + 1
	}
	
	updateContinuousPerformanceAway() {
		this.continuousPerformanceAway = this.continuousPerformanceAway - 1
	}
	
	updateContinuousPerformanceHomeV2() {
		this.continuousPerformanceHome = this.continuousPerformanceHome - 1
	}
	
	updateContinuousPerformanceAwayV2() {
		this.continuousPerformanceAway = this.continuousPerformanceAway + 1
	}
}

//subtracts a from b
export function subtract(a: number, b: number): number {
	return b - a
}

export function expectedGoalIndividual(rating:number): number {
	const RG = Math.abs(rating) / 3
	if (rating < 0) {
		return -1 * (Math.pow(10, RG) - 1)
	}
	return Math.pow(10, RG) - 1
}

export function errorGD(goalDifference: number, expectedGoalDifference: number): number {
	return Math.abs(goalDifference - expectedGoalDifference)
}

export function errorGDFunc(errorGD: number): number { return 3 * Math.log10(1+errorGD) }