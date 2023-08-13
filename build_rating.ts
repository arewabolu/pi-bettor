import { Team,expectedGoalIndividual,errorGD,errorGDFunc,subtract } from "./pi_rating"

// generate a teams home ratings
export function buildPiforHometeam(hometeam: Team, awayteam: Team, homeGoalScored:number, awayGoalScored: number): Team {
	// generate expected goals for each team
	const homexG = expectedGoalIndividual(hometeam.backgroundHomeRating)
	const AwayxG = expectedGoalIndividual(awayteam.backgroundHomeRating)
    //assume awayteam parameter is a string
    //let awayTeam = new Team(awayteam,0,0,0,0)
    //assume all away teams expected goals is always zero?
	//const AwayxG = expectedGoalIndividual(awayTeam.backgroundHomeRating)
	const xGD=subtract(homexG,AwayxG)
	const GD = subtract(homeGoalScored, awayGoalScored)

	let HomeErrfunction: number
	let errfunction = errorGDFunc(errorGD(GD, xGD))
	if (xGD > GD) {
		HomeErrfunction = -errfunction
	} else {
		HomeErrfunction = errfunction
	}
	hometeam.updateBackgroundHometeamRatings(HomeErrfunction)

	let AwayErrfunction: number
	if (xGD > GD) {
		AwayErrfunction = errfunction
	} else {
		AwayErrfunction = -errfunction
	}
	awayteam.updateBackgroundAwayteamRatings(AwayErrfunction)
	
	if (xGD >= 0 && GD > 0){
		hometeam.updateContinuousPerformanceHome()
    }
	if (xGD > 0 && GD < 0){
		hometeam.resetContinuousPerformanceHome()
		hometeam.updateContinuousPerformanceHomeV2()
    }
    if (xGD < 0 && GD > 0){
		hometeam.resetContinuousPerformanceHome()
	   hometeam.updateContinuousPerformanceHome()
    }
	if ( xGD <= 0 && GD < 0){
		hometeam.updateContinuousPerformanceHomeV2()
    }
	if ( xGD > 0 || xGD < 0 && GD == 0){
		hometeam.resetContinuousPerformanceHome()
	}

	return hometeam
}

// generate a teams away ratings
export function BuildPiforAwayteam(awayteam: Team, hometeam: Team, homeGoalScored: number, awayGoalScored: number): Team {
	//let hometeam = new Team(hometeamName,0,0,0,0)
	const HxG = expectedGoalIndividual(hometeam.backgroundHomeRating)
	const AxG = expectedGoalIndividual(awayteam.backgroundHomeRating)
	const xGD = subtract(HxG, AxG)
	const GD = subtract(homeGoalScored, awayGoalScored)

	let AwayErrfunction: number 
	const errfunction = errorGDFunc(errorGD(GD, xGD))
	if (xGD > GD) {
		AwayErrfunction = errfunction
	} else {
		AwayErrfunction = -errfunction
	}
	awayteam.updateBackgroundAwayteamRatings(AwayErrfunction)

	let HomeErrfunction: number
	if (xGD > GD) {
		HomeErrfunction = -errfunction
	} else {
		HomeErrfunction = errfunction
	}
	hometeam.updateBackgroundHometeamRatings(HomeErrfunction)

	if ( xGD >= 0 && GD > 0){
		awayteam.updateContinuousPerformanceAway()
    }
	if ( xGD > 0 && GD < 0){
		awayteam.resetContinuousPerformanceAway()
		awayteam.updateContinuousPerformanceAwayV2()
    }
	if ( xGD < 0 && GD > 0){
		awayteam.resetContinuousPerformanceAway()
		awayteam.updateContinuousPerformanceAway()
    }
	if (xGD <= 0 && GD < 0){
		awayteam.updateContinuousPerformanceAwayV2()
    }
	if ( xGD > 0 || xGD < 0 && GD == 0){
		awayteam.resetContinuousPerformanceAway()
	}

	return awayteam
}