

export default function RepoInfo( {people, repo}) {

   const sortedPeople = [...people].sort((a, b) => b.percent - a.percent);
    return (
      <div>
        <h1>Top Contributors for {repo}</h1>
        <ul role="list" className="divide-y divide-gray-100">
          {sortedPeople.map((person) => (
            <li key={person.name} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={"https://github.com/" + person.name  +".png"} alt="" />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">{person.percent}%</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  